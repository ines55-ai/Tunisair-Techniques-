import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateAgentDto, UpdateAgentDto } from './dto';

@Injectable()
export class AgentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAgentDto: CreateAgentDto) {
    const existing = await this.prisma.agent.findUnique({
      where: { matricule: createAgentDto.matricule },
    });

    if (existing) {
      throw new ConflictException('Ce matricule existe déjà');
    }

    return this.prisma.agent.create({
      data: createAgentDto,
      include: { bureau: true },
    });
  }

  async findAll() {
    return this.prisma.agent.findMany({
      where: { actif: true },
      include: {
        bureau: { select: { id: true, nom: true, code: true } },
        _count: { select: { materiels: true } },
      },
      orderBy: { nom: 'asc' },
    });
  }

  async findOne(id: number) {
    const agent = await this.prisma.agent.findUnique({
      where: { id },
      include: {
        bureau: true,
        materiels: {
          where: { actif: true },
          include: { categorie: true },
        },
      },
    });

    if (!agent) {
      throw new NotFoundException('Agent non trouvé');
    }

    return agent;
  }

  async update(id: number, updateAgentDto: UpdateAgentDto) {
    await this.findOne(id);

    if (updateAgentDto.matricule) {
      const existing = await this.prisma.agent.findFirst({
        where: {
          matricule: updateAgentDto.matricule,
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException('Ce matricule existe déjà');
      }
    }

    return this.prisma.agent.update({
      where: { id },
      data: updateAgentDto,
      include: { bureau: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const hasMateriels = await this.prisma.materiel.count({
      where: { agentId: id, actif: true },
    });

    if (hasMateriels > 0) {
      throw new ConflictException(
        'Impossible de supprimer un agent ayant des matériels assignés',
      );
    }

    return this.prisma.agent.update({
      where: { id },
      data: { actif: false },
    });
  }
}
