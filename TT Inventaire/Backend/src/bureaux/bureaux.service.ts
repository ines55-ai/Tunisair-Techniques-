import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateBureauDto, UpdateBureauDto } from './dto';

@Injectable()
export class BureauxService {
  constructor(private prisma: PrismaService) {}

  async create(createBureauDto: CreateBureauDto) {
    const existing = await this.prisma.bureau.findUnique({
      where: { code: createBureauDto.code },
    });

    if (existing) {
      throw new ConflictException('Ce code de bureau existe déjà');
    }

    return this.prisma.bureau.create({
      data: createBureauDto,
    });
  }

  async findAll() {
    return this.prisma.bureau.findMany({
      where: { actif: true },
      include: {
        _count: {
          select: {
            agents: true,
            materiels: true,
          },
        },
      },
      orderBy: { nom: 'asc' },
    });
  }

  async findOne(id: number) {
    const bureau = await this.prisma.bureau.findUnique({
      where: { id },
      include: {
        agents: {
          where: { actif: true },
          select: { id: true, nom: true, prenom: true, matricule: true },
        },
        materiels: {
          where: { actif: true },
          include: { categorie: true },
        },
      },
    });

    if (!bureau) {
      throw new NotFoundException('Bureau non trouvé');
    }

    return bureau;
  }

  async update(id: number, updateBureauDto: UpdateBureauDto) {
    await this.findOne(id);

    if (updateBureauDto.code) {
      const existing = await this.prisma.bureau.findFirst({
        where: {
          code: updateBureauDto.code,
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException('Ce code de bureau existe déjà');
      }
    }

    return this.prisma.bureau.update({
      where: { id },
      data: updateBureauDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const [hasAgents, hasMateriels] = await Promise.all([
      this.prisma.agent.count({ where: { bureauId: id, actif: true } }),
      this.prisma.materiel.count({ where: { bureauId: id, actif: true } }),
    ]);

    if (hasAgents > 0 || hasMateriels > 0) {
      throw new ConflictException(
        'Impossible de supprimer un bureau contenant des agents ou des matériels',
      );
    }

    return this.prisma.bureau.update({
      where: { id },
      data: { actif: false },
    });
  }
}
