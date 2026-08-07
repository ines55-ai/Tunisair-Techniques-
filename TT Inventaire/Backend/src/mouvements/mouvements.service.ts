import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateMouvementDto, UpdateMouvementDto, TypeMouvement } from './dto';
import { MouvementsPdfService } from './mouvements-pdf.service';

@Injectable()
export class MouvementsService {
  constructor(
    private prisma: PrismaService,
    private mouvementsPdfService: MouvementsPdfService,
  ) {}

  async create(createMouvementDto: CreateMouvementDto) {
    // Vérifier que le matériel existe
    const materiel = await this.prisma.materiel.findUnique({
      where: { id: createMouvementDto.materielId },
      include: { agent: true, stock: true },
    });

    if (!materiel) {
      throw new NotFoundException('Matériel non trouvé');
    }

    // Validation selon le type de mouvement
    await this.validateMouvement(createMouvementDto, materiel);

    // Créer le mouvement avec transaction pour garantir la cohérence
    return this.prisma.$transaction(async (tx) => {
      // Créer le mouvement
      const mouvement = await tx.mouvement.create({
        data: {
          ...createMouvementDto,
          date: createMouvementDto.date 
            ? new Date(createMouvementDto.date) 
            : new Date(),
          dateRetourPrevue: createMouvementDto.dateRetourPrevue 
            ? new Date(createMouvementDto.dateRetourPrevue) 
            : null,
        },
        include: {
          materiel: { include: { categorie: true } },
          agentSource: true,
        },
      });

      // Appliquer les effets du mouvement
      await this.applyMouvementEffects(tx, createMouvementDto, materiel);

      return mouvement;
    });
  }

  private async validateMouvement(dto: CreateMouvementDto, materiel: any) {
    switch (dto.typeMouvement) {
      case TypeMouvement.AFFECTATION:
        if (!dto.agentDestId) {
          throw new BadRequestException('Agent destination requis pour une affectation');
        }
        if (materiel.agentId) {
          throw new ConflictException('Ce matériel est déjà affecté à un agent');
        }
        // Vérifier que l'agent destination existe
        const agentDest = await this.prisma.agent.findUnique({ 
          where: { id: dto.agentDestId } 
        });
        if (!agentDest || !agentDest.actif) {
          throw new NotFoundException('Agent destination non trouvé ou inactif');
        }
        break;

      case TypeMouvement.RETOUR:
        if (!dto.agentSourceId) {
          throw new BadRequestException('Agent source requis pour un retour');
        }
        if (!dto.description) {
          throw new BadRequestException('Motif requis pour un retour');
        }
        if (!materiel.agentId || materiel.agentId !== dto.agentSourceId) {
          throw new ConflictException('Ce matériel n\'est pas affecté à cet agent');
        }
        break;

      case TypeMouvement.TRANSFERT:
        if (!dto.agentSourceId || !dto.agentDestId) {
          throw new BadRequestException('Agent source et destination requis pour un transfert');
        }
        if (!dto.description) {
          throw new BadRequestException('Motif requis pour un transfert');
        }
        if (dto.agentSourceId === dto.agentDestId) {
          throw new BadRequestException('Les agents source et destination doivent être différents');
        }
        if (!materiel.agentId || materiel.agentId !== dto.agentSourceId) {
          throw new ConflictException('Ce matériel n\'est pas affecté à l\'agent source');
        }
        // Vérifier que l'agent destination existe
        const agentTransfertDest = await this.prisma.agent.findUnique({ 
          where: { id: dto.agentDestId } 
        });
        if (!agentTransfertDest || !agentTransfertDest.actif) {
          throw new NotFoundException('Agent destination non trouvé ou inactif');
        }
        break;

      case TypeMouvement.MAINTENANCE:
        if (!dto.description) {
          throw new BadRequestException('Motif requis pour une maintenance');
        }
        break;

      case TypeMouvement.REFORME:
        if (!dto.description) {
          throw new BadRequestException('Motif requis pour une réforme');
        }
        if (!dto.effectuePar) {
          throw new BadRequestException('Validation requise pour une réforme');
        }
        break;
    }
  }

  private async applyMouvementEffects(tx: any, dto: CreateMouvementDto, materiel: any) {
    switch (dto.typeMouvement) {
      case TypeMouvement.AFFECTATION:
        // Mettre à jour le matériel
        await tx.materiel.update({
          where: { id: dto.materielId },
          data: {
            agentId: dto.agentDestId,
            statut: 'EN_SERVICE',
          },
        });
        // Supprimer du stock si présent
        if (materiel.stock) {
          await tx.stock.delete({
            where: { id: materiel.stock.id },
          });
        }
        break;

      case TypeMouvement.RETOUR:
        // Clôturer le mouvement d'affectation précédent
        await tx.mouvement.updateMany({
          where: {
            materielId: dto.materielId,
            typeMouvement: 'AFFECTATION',
            dateRetourPrevue: null,
          },
          data: {
            dateRetourPrevue: new Date(),
          },
        });
        // Mettre à jour le matériel
        await tx.materiel.update({
          where: { id: dto.materielId },
          data: {
            agentId: null,
            statut: 'EN_STOCK',
          },
        });
        // Créer une entrée stock
        await tx.stock.create({
          data: {
            materielId: dto.materielId,
            dateArrivage: new Date(),
            etat: 'DISPONIBLE',
            remarques: `Retour: ${dto.description}`,
          },
        });
        break;

      case TypeMouvement.TRANSFERT:
        // Clôturer le mouvement d'affectation précédent
        await tx.mouvement.updateMany({
          where: {
            materielId: dto.materielId,
            typeMouvement: 'AFFECTATION',
            dateRetourPrevue: null,
          },
          data: {
            dateRetourPrevue: new Date(),
          },
        });
        // Mettre à jour le matériel
        await tx.materiel.update({
          where: { id: dto.materielId },
          data: {
            agentId: dto.agentDestId,
          },
        });
        break;

      case TypeMouvement.MAINTENANCE:
        // Sauvegarder l'agent actuel pour réaffectation
        if (materiel.agentId) {
          await tx.mouvement.updateMany({
            where: {
              materielId: dto.materielId,
              typeMouvement: 'AFFECTATION',
              dateRetourPrevue: null,
            },
            data: {
              dateRetourPrevue: new Date(),
            },
          });
        }
        // Mettre à jour le matériel
        await tx.materiel.update({
          where: { id: dto.materielId },
          data: {
            agentId: null,
            statut: 'EN_MAINTENANCE',
          },
        });
        break;

      case TypeMouvement.REFORME:
        // Clôturer tous les mouvements en cours
        await tx.mouvement.updateMany({
          where: {
            materielId: dto.materielId,
            dateRetourPrevue: null,
          },
          data: {
            dateRetourPrevue: new Date(),
          },
        });
        // Mettre à jour le matériel
        await tx.materiel.update({
          where: { id: dto.materielId },
          data: {
            agentId: null,
            statut: 'REFORME',
            actif: false,
          },
        });
        // Supprimer du stock si présent
        if (materiel.stock) {
          await tx.stock.delete({
            where: { materielId: dto.materielId },
          });
        }
        break;
    }
  }

  async findAll(page = 1, limit = 10, filters?: any) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (filters?.typeMouvement) {
      where.typeMouvement = filters.typeMouvement;
    }
    
    if (filters?.materielId) {
      where.materielId = parseInt(filters.materielId);
    }
    
    if (filters?.agentId) {
      where.OR = [
        { agentSourceId: parseInt(filters.agentId) },
        { agentDestId: parseInt(filters.agentId) },
      ];
    }
    
    if (filters?.dateDebut) {
      where.date = {
        gte: new Date(filters.dateDebut),
      };
    }
    
    if (filters?.dateFin) {
      where.date = {
        ...where.date,
        lte: new Date(filters.dateFin),
      };
    }
    
    if (filters?.enCours !== undefined) {
      const enCours = filters.enCours === 'true' || filters.enCours === true;
      where.cloture = !enCours; // En cours = not cloture
    }

    const [mouvements, total] = await Promise.all([
      this.prisma.mouvement.findMany({
        where,
        skip,
        take: limit,
        include: {
          materiel: {
            include: { categorie: true },
          },
          agentSource: true,
          agentDest: true,
        },
        orderBy: { date: 'desc' },
      }),
      this.prisma.mouvement.count({ where }),
    ]);

    return {
      data: mouvements,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const mouvement = await this.prisma.mouvement.findUnique({
      where: { id },
      include: {
        materiel: {
          include: { categorie: true },
        },
        agentSource: true,
        agentDest: true,
      },
    });

    if (!mouvement) {
      throw new NotFoundException('Mouvement non trouvé');
    }

    return mouvement;
  }

  async findByMateriel(materielId: number) {
    return this.prisma.mouvement.findMany({
      where: { materielId },
      include: {
        agentSource: true,
        agentDest: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async findByAgent(agentId: number) {
    return this.prisma.mouvement.findMany({
      where: {
        OR: [
          { agentSourceId: agentId },
          { agentDestId: agentId },
        ],
      },
      include: {
        materiel: {
          include: { categorie: true },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async update(id: number, updateMouvementDto: UpdateMouvementDto) {
    await this.findOne(id);

    return this.prisma.mouvement.update({
      where: { id },
      data: {
        ...updateMouvementDto,
        date: updateMouvementDto.date
          ? new Date(updateMouvementDto.date)
          : undefined,
        dateRetourPrevue: updateMouvementDto.dateRetourPrevue
          ? new Date(updateMouvementDto.dateRetourPrevue)
          : undefined,
      },
      include: {
        materiel: { include: { categorie: true } },
        agentSource: true,
      },
    });
  }

  async cloturerMouvement(id: number) {
    const mouvement = await this.findOne(id);

    if (mouvement.cloture) {
      throw new ConflictException('Ce mouvement est déjà clôturé');
    }

    return this.prisma.mouvement.update({
      where: { id },
      data: { 
        dateRetourPrevue: new Date(),
        cloture: true,
      },
      include: {
        materiel: { include: { categorie: true } },
        agentSource: true,
        agentDest: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.mouvement.delete({
      where: { id },
    });
  }

  async getStatistics() {
    const [
      totalMouvements,
      mouvementsParType,
      mouvementsEnCours,
      mouvementsCeMois,
      top10Materiels,
    ] = await Promise.all([
      // Total
      this.prisma.mouvement.count(),

      // Par type
      this.prisma.mouvement.groupBy({
        by: ['typeMouvement'],
        _count: true,
      }),

      // En cours
      this.prisma.mouvement.count({
        where: { dateRetourPrevue: null },
      }),

      // Ce mois
      this.prisma.mouvement.count({
        where: {
          date: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),

      // Top 10 matériels les plus déplacés
      this.prisma.mouvement.groupBy({
        by: ['materielId'],
        _count: true,
        orderBy: {
          _count: {
            materielId: 'desc',
          },
        },
        take: 10,
      }),
    ]);

    // Récupérer les détails des top matériels
    const materielIds = top10Materiels.map((m) => m.materielId);
    const materielsDetails = await this.prisma.materiel.findMany({
      where: { id: { in: materielIds } },
      include: { categorie: true },
    });

    const top10WithDetails = top10Materiels.map((item) => ({
      materiel: materielsDetails.find((m) => m.id === item.materielId),
      count: item._count,
    }));

    return {
      total: totalMouvements,
      parType: mouvementsParType.reduce((acc, item) => {
        acc[item.typeMouvement] = item._count;
        return acc;
      }, {} as Record<string, number>),
      enCours: mouvementsEnCours,
      ceMois: mouvementsCeMois,
      top10Materiels: top10WithDetails,
    };
  }

  async generatePDF(id: number): Promise<PDFKit.PDFDocument> {
    const mouvement = await this.prisma.mouvement.findUnique({
      where: { id },
      include: {
        materiel: {
          include: { categorie: true },
        },
        agentSource: true,
        agentDest: true,
      },
    });

    if (!mouvement) {
      throw new NotFoundException('Mouvement non trouvé');
    }

    return this.mouvementsPdfService.generateMouvementPDF(mouvement);
  }
}
