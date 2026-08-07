import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateMaterielDto, UpdateMaterielDto } from './dto';

@Injectable()
export class MaterielsService {
  constructor(private prisma: PrismaService) {}

  async create(createMaterielDto: CreateMaterielDto) {
    // Vérifier si le numéro de série existe déjà
    const existing = await this.prisma.materiel.findUnique({
      where: { numeroSerie: createMaterielDto.numeroSerie },
    });

    if (existing) {
      throw new ConflictException('Ce numéro de série existe déjà');
    }

    // Vérifier si le numéro d'inventaire existe déjà (s'il est fourni)
    if (createMaterielDto.numeroInventaire) {
      const existingInventaire = await this.prisma.materiel.findUnique({
        where: { numeroInventaire: createMaterielDto.numeroInventaire },
      });

      if (existingInventaire) {
        throw new ConflictException("Ce numéro d'inventaire existe déjà");
      }
    }

    return this.prisma.materiel.create({
      data: createMaterielDto,
      include: {
        categorie: true,
        agent: true,
        bureau: true,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { nom: { contains: search } },
            { numeroSerie: { contains: search } },
            { numeroInventaire: { contains: search } },
            { marque: { contains: search } },
            { modele: { contains: search } },
          ],
        }
      : {};

    const [materiels, total] = await Promise.all([
      this.prisma.materiel.findMany({
        where,
        skip,
        take: limit,
        include: {
          categorie: true,
          agent: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              matricule: true,
            },
          },
          bureau: {
            select: {
              id: true,
              nom: true,
              code: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.materiel.count({ where }),
    ]);

    return {
      data: materiels,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const materiel = await this.prisma.materiel.findUnique({
      where: { id },
      include: {
        categorie: true,
        agent: true,
        bureau: true,
        mouvements: {
          take: 10,
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!materiel) {
      throw new NotFoundException('Matériel non trouvé');
    }

    return materiel;
  }

  async update(id: number, updateMaterielDto: UpdateMaterielDto) {
    await this.findOne(id); // Vérifie que le matériel existe

    // Vérifier l'unicité du numéro de série si modifié
    if (updateMaterielDto.numeroSerie) {
      const existing = await this.prisma.materiel.findFirst({
        where: {
          numeroSerie: updateMaterielDto.numeroSerie,
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException('Ce numéro de série existe déjà');
      }
    }

    return this.prisma.materiel.update({
      where: { id },
      data: updateMaterielDto,
      include: {
        categorie: true,
        agent: true,
        bureau: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Vérifie que le matériel existe

    return this.prisma.materiel.update({
      where: { id },
      data: { actif: false },
    });
  }

  async getStatistics() {
    const [total, enService, enPanne, enMaintenance, enStock, reforme] =
      await Promise.all([
        this.prisma.materiel.count({ where: { actif: true } }),
        this.prisma.materiel.count({
          where: { actif: true, statut: 'EN_SERVICE' },
        }),
        this.prisma.materiel.count({
          where: { actif: true, statut: 'EN_PANNE' },
        }),
        this.prisma.materiel.count({
          where: { actif: true, statut: 'EN_MAINTENANCE' },
        }),
        this.prisma.materiel.count({
          where: { actif: true, statut: 'EN_STOCK' },
        }),
        this.prisma.materiel.count({
          where: { actif: true, statut: 'REFORME' },
        }),
      ]);

    return {
      total,
      enService,
      enPanne,
      enMaintenance,
      enStock,
      reforme,
    };
  }
}
