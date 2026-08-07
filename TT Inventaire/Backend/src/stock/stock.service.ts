import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateStockDto, UpdateStockDto } from './dto';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async create(createStockDto: CreateStockDto) {
    // Vérifier que le matériel existe
    const materiel = await this.prisma.materiel.findUnique({
      where: { id: createStockDto.materielId },
    });

    if (!materiel) {
      throw new NotFoundException('Matériel non trouvé');
    }

    // Vérifier qu'il n'y a pas déjà une entrée stock pour ce matériel
    const existingStock = await this.prisma.stock.findUnique({
      where: { materielId: createStockDto.materielId },
    });

    if (existingStock) {
      throw new ConflictException('Ce matériel est déjà en stock');
    }

    // Créer l'entrée stock
    const stock = await this.prisma.stock.create({
      data: {
        ...createStockDto,
        dateArrivage: createStockDto.dateArrivage
          ? new Date(createStockDto.dateArrivage)
          : new Date(),
      },
      include: {
        materiel: {
          include: {
            categorie: true,
          },
        },
      },
    });

    // Mettre à jour le statut du matériel à EN_STOCK si nécessaire
    if (materiel.statut !== 'EN_STOCK') {
      await this.prisma.materiel.update({
        where: { id: createStockDto.materielId },
        data: { statut: 'EN_STOCK' },
      });
    }

    return stock;
  }

  async findAll() {
    return this.prisma.stock.findMany({
      include: {
        materiel: {
          include: {
            categorie: true,
          },
        },
      },
      orderBy: { dateArrivage: 'desc' },
    });
  }

  async findOne(id: number) {
    const stock = await this.prisma.stock.findUnique({
      where: { id },
      include: {
        materiel: {
          include: {
            categorie: true,
          },
        },
      },
    });

    if (!stock) {
      throw new NotFoundException('Entrée stock non trouvée');
    }

    return stock;
  }

  async findByMaterielId(materielId: number) {
    const stock = await this.prisma.stock.findUnique({
      where: { materielId },
      include: {
        materiel: {
          include: {
            categorie: true,
          },
        },
      },
    });

    if (!stock) {
      throw new NotFoundException('Ce matériel n\'est pas en stock');
    }

    return stock;
  }

  async update(id: number, updateStockDto: UpdateStockDto) {
    await this.findOne(id);

    return this.prisma.stock.update({
      where: { id },
      data: {
        ...updateStockDto,
        dateArrivage: updateStockDto.dateArrivage
          ? new Date(updateStockDto.dateArrivage)
          : undefined,
      },
      include: {
        materiel: {
          include: {
            categorie: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.stock.delete({
      where: { id },
    });
  }

  async getStatistics() {
    const [total, parEtat, alertes, recent] = await Promise.all([
      // Total matériels en stock
      this.prisma.stock.count(),

      // Grouper par état
      this.prisma.stock.groupBy({
        by: ['etat'],
        _count: true,
      }),

      // Matériels sous le seuil d'alerte
      this.prisma.stock.findMany({
        where: {
          seuilAlerte: {
            not: null,
          },
        },
        include: {
          materiel: {
            include: {
              categorie: true,
            },
          },
        },
      }),

      // Arrivages récents (derniers 30 jours)
      this.prisma.stock.findMany({
        where: {
          dateArrivage: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        include: {
          materiel: {
            include: {
              categorie: true,
            },
          },
        },
        orderBy: { dateArrivage: 'desc' },
        take: 10,
      }),
    ]);

    // Filtrer les alertes où quantite < seuilAlerte
    const materielsSousAlerte = alertes.filter(
      (stock) => stock.quantite < (stock.seuilAlerte || 0),
    );

    return {
      total,
      parEtat: parEtat.reduce(
        (acc, item) => {
          acc[item.etat] = item._count;
          return acc;
        },
        {} as Record<string, number>,
      ),
      alertes: materielsSousAlerte.length,
      materielsSousAlerte,
      arrivagesRecents: recent,
    };
  }
}

