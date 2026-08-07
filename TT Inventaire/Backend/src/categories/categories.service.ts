import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateCategorieDto, UpdateCategorieDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategorieDto: CreateCategorieDto) {
    const existing = await this.prisma.categorie.findUnique({
      where: { code: createCategorieDto.code },
    });

    if (existing) {
      throw new ConflictException('Ce code de catégorie existe déjà');
    }

    return this.prisma.categorie.create({
      data: createCategorieDto,
    });
  }

  async findAll() {
    return this.prisma.categorie.findMany({
      where: { actif: true },
      include: {
        _count: {
          select: { materiels: true },
        },
      },
      orderBy: { nom: 'asc' },
    });
  }

  async findOne(id: number) {
    const categorie = await this.prisma.categorie.findUnique({
      where: { id },
      include: {
        materiels: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { materiels: true },
        },
      },
    });

    if (!categorie) {
      throw new NotFoundException('Catégorie non trouvée');
    }

    return categorie;
  }

  async update(id: number, updateCategorieDto: UpdateCategorieDto) {
    await this.findOne(id);

    if (updateCategorieDto.code) {
      const existing = await this.prisma.categorie.findFirst({
        where: {
          code: updateCategorieDto.code,
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException('Ce code de catégorie existe déjà');
      }
    }

    return this.prisma.categorie.update({
      where: { id },
      data: updateCategorieDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const hasMateriels = await this.prisma.materiel.count({
      where: { categorieId: id, actif: true },
    });

    if (hasMateriels > 0) {
      throw new ConflictException(
        'Impossible de supprimer une catégorie contenant des matériels',
      );
    }

    return this.prisma.categorie.update({
      where: { id },
      data: { actif: false },
    });
  }
}
