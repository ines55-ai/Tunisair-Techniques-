import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { 
  CreateInventaireDto, 
  UpdateInventaireDto, 
  CreateInventaireLigneDto,
  UpdateInventaireLigneDto,
  StatutInventaire,
  PerimetreType 
} from './dto';

@Injectable()
export class InventairesService {
  constructor(private prisma: PrismaService) {}

  async create(createInventaireDto: CreateInventaireDto) {
    // Générer une référence unique
    const reference = await this.generateReference();

    // Créer l'inventaire avec transaction
    return this.prisma.$transaction(async (tx) => {
      // Créer l'inventaire
      const inventaire = await tx.inventaire.create({
        data: {
          reference,
          titre: createInventaireDto.titre,
          dateDebut: createInventaireDto.dateDebut
            ? new Date(createInventaireDto.dateDebut)
            : new Date(),
          statut: StatutInventaire.EN_COURS,
          responsable: createInventaireDto.responsable,
          remarques: createInventaireDto.remarques,
        },
      });

      // Générer les lignes selon le périmètre
      await this.generateLignes(
        tx,
        inventaire.id,
        createInventaireDto.perimetreType || PerimetreType.TOUS,
        createInventaireDto.perimetreIds || [],
      );

      // Retourner l'inventaire avec ses lignes
      return tx.inventaire.findUnique({
        where: { id: inventaire.id },
        include: {
          lignes: {
            include: {
              materiel: {
                include: { categorie: true },
              },
            },
          },
        },
      });
    });
  }

  private async generateReference(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.inventaire.count({
      where: {
        reference: {
          startsWith: `INV-${year}-`,
        },
      },
    });
    const sequence = (count + 1).toString().padStart(3, '0');
    return `INV-${year}-${sequence}`;
  }

  private async generateLignes(
    tx: any,
    inventaireId: number,
    perimetreType: PerimetreType,
    perimetreIds: number[],
  ) {
    let materielIds: number[] = [];

    switch (perimetreType) {
      case PerimetreType.TOUS:
        // Tous les matériels actifs
        const allMateriels = await tx.materiel.findMany({
          where: { actif: true },
          select: { id: true },
        });
        materielIds = allMateriels.map((m: any) => m.id);
        break;

      case PerimetreType.CATEGORIE:
        // Matériels d'une ou plusieurs catégories
        const materielsByCategorie = await tx.materiel.findMany({
          where: {
            actif: true,
            categorieId: { in: perimetreIds },
          },
          select: { id: true },
        });
        materielIds = materielsByCategorie.map((m: any) => m.id);
        break;

      case PerimetreType.BUREAU:
        // Matériels d'un ou plusieurs bureaux
        const materielsByBureau = await tx.materiel.findMany({
          where: {
            actif: true,
            bureauId: { in: perimetreIds },
          },
          select: { id: true },
        });
        materielIds = materielsByBureau.map((m: any) => m.id);
        break;

      case PerimetreType.AGENT:
        // Matériels d'un ou plusieurs agents
        const materielsByAgent = await tx.materiel.findMany({
          where: {
            actif: true,
            agentId: { in: perimetreIds },
          },
          select: { id: true },
        });
        materielIds = materielsByAgent.map((m: any) => m.id);
        break;

      case PerimetreType.STATUT:
        // Matériels par statut (perimetreIds contient les codes statut comme string)
        // Note: Nécessite une conversion car Prisma enum
        const materielsByStatut = await tx.materiel.findMany({
          where: {
            actif: true,
            statut: { in: perimetreIds as any }, // Les statuts sont passés en tant que strings
          },
          select: { id: true },
        });
        materielIds = materielsByStatut.map((m: any) => m.id);
        break;
    }

    // Créer les lignes en batch
    if (materielIds.length > 0) {
      const lignesData = materielIds.map((materielId) => ({
        inventaireId,
        materielId,
        trouve: false,
      }));

      await tx.inventaireLigne.createMany({
        data: lignesData,
      });
    }
  }

  async findAll(page = 1, limit = 10, filters?: any) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters?.statut) {
      where.statut = filters.statut;
    }

    if (filters?.responsable) {
      where.responsable = {
        contains: filters.responsable,
      };
    }

    if (filters?.dateDebut) {
      where.dateDebut = {
        gte: new Date(filters.dateDebut),
      };
    }

    const [inventaires, total] = await Promise.all([
      this.prisma.inventaire.findMany({
        where,
        skip,
        take: limit,
        include: {
          lignes: true,
        },
        orderBy: { dateDebut: 'desc' },
      }),
      this.prisma.inventaire.count({ where }),
    ]);

    return inventaires;
  }

  async findOne(id: number) {
    const inventaire = await this.prisma.inventaire.findUnique({
      where: { id },
      include: {
        lignes: {
          include: {
            materiel: {
              include: {
                categorie: true,
                agent: true,
                bureau: true,
              },
            },
          },
          orderBy: { materiel: { numeroSerie: 'asc' } },
        },
      },
    });

    if (!inventaire) {
      throw new NotFoundException('Inventaire non trouvé');
    }

    // Calculer la progression
    const totalLignes = inventaire.lignes.length;
    const lignesTrouvees = inventaire.lignes.filter((l) => l.trouve).length;

    return {
      ...inventaire,
      progression: {
        total: totalLignes,
        verifies: lignesTrouvees,
        pourcentage: totalLignes > 0 ? Math.round((lignesTrouvees / totalLignes) * 100) : 0,
      },
    };
  }

  async update(id: number, updateInventaireDto: UpdateInventaireDto) {
    await this.findOne(id);

    return this.prisma.inventaire.update({
      where: { id },
      data: {
        ...updateInventaireDto,
        dateDebut: updateInventaireDto.dateDebut
          ? new Date(updateInventaireDto.dateDebut)
          : undefined,
        dateFin: updateInventaireDto.dateFin
          ? new Date(updateInventaireDto.dateFin)
          : undefined,
      },
      include: {
        lignes: {
          include: {
            materiel: {
              include: { categorie: true },
            },
          },
        },
      },
    });
  }

  async cloturerInventaire(id: number) {
    const inventaire = await this.findOne(id);

    if (inventaire.statut !== StatutInventaire.EN_COURS) {
      throw new ConflictException('Seul un inventaire en cours peut être clôturé');
    }

    // Vérifier le taux de vérification minimum (80%)
    if (inventaire.progression.pourcentage < 80) {
      throw new BadRequestException(
        'Au moins 80% des matériels doivent être vérifiés avant la clôture',
      );
    }

    return this.prisma.inventaire.update({
      where: { id },
      data: {
        statut: StatutInventaire.TERMINE,
        dateFin: new Date(),
      },
    });
  }

  async validerInventaire(id: number) {
    const inventaire = await this.prisma.inventaire.findUnique({
      where: { id },
    });

    if (!inventaire) {
      throw new NotFoundException('Inventaire non trouvé');
    }

    if (inventaire.statut !== StatutInventaire.TERMINE) {
      throw new ConflictException('Seul un inventaire terminé peut être validé');
    }

    return this.prisma.inventaire.update({
      where: { id },
      data: {
        statut: StatutInventaire.VALIDE,
      },
    });
  }

  async annulerInventaire(id: number, motif?: string) {
    const inventaire = await this.prisma.inventaire.findUnique({
      where: { id },
    });

    if (!inventaire) {
      throw new NotFoundException('Inventaire non trouvé');
    }

    if (inventaire.statut === StatutInventaire.VALIDE) {
      throw new ConflictException('Un inventaire validé ne peut pas être annulé');
    }

    return this.prisma.inventaire.update({
      where: { id },
      data: {
        statut: StatutInventaire.ANNULE,
        remarques: motif 
          ? `${inventaire.remarques || ''}\n\nANNULÉ: ${motif}`
          : `${inventaire.remarques || ''}\n\nANNULÉ`,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    // Supprimer d'abord les lignes puis l'inventaire
    await this.prisma.inventaireLigne.deleteMany({
      where: { inventaireId: id },
    });

    return this.prisma.inventaire.delete({
      where: { id },
    });
  }

  // Gestion des lignes
  async updateLigne(ligneId: number, updateLigneDto: UpdateInventaireLigneDto) {
    const ligne = await this.prisma.inventaireLigne.findUnique({
      where: { id: ligneId },
    });

    if (!ligne) {
      throw new NotFoundException('Ligne d\'inventaire non trouvée');
    }

    return this.prisma.inventaireLigne.update({
      where: { id: ligneId },
      data: {
        ...updateLigneDto,
        dateVerif: updateLigneDto.dateVerif
          ? new Date(updateLigneDto.dateVerif)
          : updateLigneDto.trouve
          ? new Date()
          : undefined,
      },
      include: {
        materiel: {
          include: { categorie: true },
        },
      },
    });
  }

  async marquerTrouve(ligneId: number, etat: string, verifPar: string, remarques?: string) {
    return this.updateLigne(ligneId, {
      trouve: true,
      etat,
      verifPar,
      remarques,
      dateVerif: new Date().toISOString(),
    } as any);
  }

  async getEcarts(inventaireId: number) {
    const inventaire = await this.findOne(inventaireId);

    const manquants = inventaire.lignes.filter((l) => !l.trouve);
    
    // Pour les surplus, on cherche les matériels qui existent dans la base
    // mais qui ne sont pas dans les lignes d'inventaire
    const materielIdsInventaire = inventaire.lignes.map(l => l.materielId);
    const surplus = await this.prisma.materiel.findMany({
      where: {
        actif: true,
        id: {
          notIn: materielIdsInventaire,
        },
      },
      include: {
        categorie: true,
      },
    });

    return {
      manquants,
      surplus,
    };
  }

  async getStatistics() {
    const [total, enCours, termines, valides] = await Promise.all([
      this.prisma.inventaire.count(),
      this.prisma.inventaire.count({
        where: { statut: StatutInventaire.EN_COURS },
      }),
      this.prisma.inventaire.count({
        where: { statut: StatutInventaire.TERMINE },
      }),
      this.prisma.inventaire.count({
        where: { statut: StatutInventaire.VALIDE },
      }),
    ]);

    return {
      total,
      enCours,
      termines,
      valides,
    };
  }
}
