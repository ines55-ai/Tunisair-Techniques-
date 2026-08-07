import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStatistics() {
    const [
      totalMateriels,
      materielsEnService,
      materielsEnPanne,
      materielsEnMaintenance,
      materielsEnStock,
      materielsAffectes,
      materielsLibres,
      totalAgents,
      totalBureaux,
      totalCategories,
      recentMateriels,
      recentMovements,
    ] = await Promise.all([
      // Statistiques matériels
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
        where: { actif: true, agentId: { not: null } },
      }),
      this.prisma.materiel.count({
        where: { actif: true, agentId: null, statut: { not: 'EN_STOCK' } },
      }),

      // Statistiques générales
      this.prisma.agent.count({ where: { actif: true } }),
      this.prisma.bureau.count({ where: { actif: true } }),
      this.prisma.categorie.count({ where: { actif: true } }),

      // Matériels récents
      this.prisma.materiel.findMany({
        where: { actif: true },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          categorie: { select: { nom: true } },
          agent: { select: { nom: true, prenom: true } },
        },
      }),

      // Mouvements récents
      this.prisma.mouvement.findMany({
        take: 5,
        orderBy: { date: 'desc' },
        include: {
          materiel: { select: { nom: true, numeroSerie: true } },
          agentSource: { select: { nom: true, prenom: true } },
        },
      }),
    ]);

    // Matériels par catégorie
    const materielsByCategorie = await this.prisma.categorie.findMany({
      where: { actif: true },
      include: {
        _count: {
          select: { materiels: { where: { actif: true } } },
        },
      },
    });

    // Matériels par statut
    const materielsByStatut = await this.prisma.materiel.groupBy({
      by: ['statut'],
      where: { actif: true },
      _count: true,
    });

    return {
      statistics: {
        materiels: {
          total: totalMateriels,
          enService: materielsEnService,
          enPanne: materielsEnPanne,
          enMaintenance: materielsEnMaintenance,
          enStock: materielsEnStock,
          affectes: materielsAffectes,
          libres: materielsLibres,
        },
        agents: totalAgents,
        bureaux: totalBureaux,
        categories: totalCategories,
      },
      materielsByCategorie: materielsByCategorie.map((cat) => ({
        nom: cat.nom,
        count: cat._count.materiels,
      })),
      materielsByStatut: materielsByStatut.map((stat) => ({
        statut: stat.statut,
        count: stat._count,
      })),
      recentMateriels,
      recentMovements,
    };
  }
}
