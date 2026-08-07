import PDFDocument from 'pdfkit';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { addPdfBrandHeader } from '../common/pdf-branding.util';

@Injectable()
export class RapportsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Générer un rapport mensuel complet
   */
  async generateMonthlyReport(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Récupérer toutes les données du mois
    const [materiels, mouvements, inventaires, agents, bureaux] = await Promise.all([
      this.getMaterielsByPeriod(startDate, endDate),
      this.getMouvementsByPeriod(startDate, endDate),
      this.getInventairesByPeriod(startDate, endDate),
      this.getAgentActivities(startDate, endDate),
      this.getBureauxStats(startDate, endDate),
    ]);

    return {
      periode: {
        annee: year,
        mois: month,
        debut: startDate,
        fin: endDate,
      },
      statistiques: {
        materiels: {
          total: await this.prisma.materiel.count(),
          nouveaux: materiels.nouveaux,
          modifies: materiels.modifies,
          parStatut: materiels.parStatut,
        },
        mouvements: {
          total: mouvements.total,
          parType: mouvements.parType,
          details: mouvements.details,
        },
        inventaires: {
          total: inventaires.total,
          termines: inventaires.termines,
          details: inventaires.details,
        },
        agents: agents,
        bureaux: bureaux,
      },
    };
  }

  /**
   * Matériels par période
   */
  private async getMaterielsByPeriod(startDate: Date, endDate: Date) {
    const nouveaux = await this.prisma.materiel.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const modifies = await this.prisma.materiel.count({
      where: {
        updatedAt: {
          gte: startDate,
          lte: endDate,
        },
        createdAt: {
          lt: startDate,
        },
      },
    });

    const parStatut = await this.prisma.materiel.groupBy({
      by: ['statut'],
      _count: true,
    });

    return {
      nouveaux,
      modifies,
      parStatut: parStatut.reduce((acc, item) => {
        acc[item.statut] = item._count;
        return acc;
      }, {} as Record<string, number>),
    };
  }

  /**
   * Mouvements par période
   */
  private async getMouvementsByPeriod(startDate: Date, endDate: Date) {
    const mouvements = await this.prisma.mouvement.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        materiel: {
          select: { numeroSerie: true, nom: true },
        },
        agentSource: {
          select: { matricule: true, nom: true, prenom: true },
        },
        agentDest: {
          select: { matricule: true, nom: true, prenom: true },
        },
      },
    });

    const parType = await this.prisma.mouvement.groupBy({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      by: ['typeMouvement'],
      _count: true,
    });

    return {
      total: mouvements.length,
      parType: parType.reduce((acc, item) => {
        acc[item.typeMouvement] = item._count as any;
        return acc;
      }, {} as Record<string, number>),
      details: mouvements,
    };
  }

  /**
   * Inventaires par période
   */
  private async getInventairesByPeriod(startDate: Date, endDate: Date) {
    const inventaires = await this.prisma.inventaire.findMany({
      where: {
        dateDebut: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        _count: {
          select: { lignes: true },
        },
      },
    });

    const termines = inventaires.filter(
      (inv) => inv.statut === 'TERMINE' || inv.statut === 'VALIDE',
    ).length;

    return {
      total: inventaires.length,
      termines,
      details: inventaires,
    };
  }

  /**
   * Activités des agents
   */
  private async getAgentActivities(startDate: Date, endDate: Date) {
    const total = await this.prisma.agent.count();

    const avecMateriels = await this.prisma.agent.count({
      where: {
        materiels: {
          some: {},
        },
      },
    });

    return {
      total,
      avecMateriels,
      sansMateriels: total - avecMateriels,
    };
  }

  /**
   * Statistiques des bureaux
   */
  private async getBureauxStats(startDate: Date, endDate: Date) {
    const bureaux = await this.prisma.bureau.findMany({
      include: {
        _count: {
          select: { agents: true, materiels: true },
        },
      },
    });

    return {
      total: bureaux.length,
      occupes: bureaux.filter((b) => b._count.agents > 0).length,
      vides: bureaux.filter((b) => b._count.agents === 0).length,
    };
  }

  /**
   * Générer un PDF du rapport mensuel
   */
  async generatePDF(year: number, month: number): Promise<Buffer> {
    const data = await this.generateMonthlyReport(year, month);
    
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // En-tête
      doc.y = addPdfBrandHeader(
        doc,
        'Rapport Mensuel IT Inventaire',
        `Période: ${this.getMonthName(month)} ${year}`,
      );
      doc.moveDown(1);

      const summaryTop = doc.y;
      doc.rect(50, summaryTop, 495, 70).fillAndStroke('#f4f8ff', '#d2e3fc').fillColor('#000000');
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('Synthèse Exécutive', 60, summaryTop + 10)
        .font('Helvetica')
        .text(
          `Matériels: ${data.statistiques.materiels.total} | Mouvements du mois: ${data.statistiques.mouvements.total} | Inventaires: ${data.statistiques.inventaires.total}`,
          60,
          summaryTop + 30,
          { width: 475 },
        );
      doc.y = summaryTop + 85;

      // Section Matériels
      doc.fontSize(15).font('Helvetica-Bold').text('1) Matériels');
      doc.moveDown(0.3);
      doc.fontSize(11).font('Helvetica');
      doc.text(`- Total parc: ${data.statistiques.materiels.total}`);
      doc.text(`- Nouveaux ce mois: ${data.statistiques.materiels.nouveaux}`);
      doc.text(`- Modifiés ce mois: ${data.statistiques.materiels.modifies}`);
      doc.text('- Répartition par statut:');
      Object.entries(data.statistiques.materiels.parStatut).forEach(([statut, count]) => {
        doc.text(`   • ${this.getMaterielStatutLabel(statut)}: ${count}`);
      });
      doc.moveDown(0.8);

      // Section Mouvements
      doc.fontSize(15).font('Helvetica-Bold').text('2) Mouvements');
      doc.moveDown(0.3);
      doc.fontSize(11).font('Helvetica');
      doc.text(`- Total mouvements du mois: ${data.statistiques.mouvements.total}`);
      doc.text('- Répartition par type:');
      Object.entries(data.statistiques.mouvements.parType).forEach(([type, count]) => {
        doc.text(`   • ${this.getMouvementTypeLabel(type)}: ${count}`);
      });
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('Mouvements récents (max 8):');
      doc.font('Helvetica');
      data.statistiques.mouvements.details.slice(0, 8).forEach((mouvement: any) => {
        const materiel = mouvement.materiel?.nom || 'Matériel non renseigné';
        const source = mouvement.agentSource
          ? `${mouvement.agentSource.nom} ${mouvement.agentSource.prenom}`
          : '-';
        const dest = mouvement.agentDest
          ? `${mouvement.agentDest.nom} ${mouvement.agentDest.prenom}`
          : '-';
        doc.text(
          `   • ${this.formatDate(mouvement.date)} | ${this.getMouvementTypeLabel(mouvement.typeMouvement)} | ${materiel} | Source: ${source} | Dest: ${dest}`,
          { width: 495 },
        );
      });
      doc.moveDown(0.8);

      // Section Inventaires
      doc.fontSize(15).font('Helvetica-Bold').text('3) Inventaires');
      doc.moveDown(0.3);
      doc.fontSize(11).font('Helvetica');
      doc.text(`- Inventaires lancés ce mois: ${data.statistiques.inventaires.total}`);
      doc.text(`- Inventaires terminés/validés: ${data.statistiques.inventaires.termines}`);
      doc.moveDown(0.8);

      // Section Ressources
      doc.fontSize(15).font('Helvetica-Bold').text('4) Ressources');
      doc.moveDown(0.3);
      doc.fontSize(11).font('Helvetica');
      doc.text(`- Agents total: ${data.statistiques.agents.total}`);
      doc.text(`- Agents avec matériels: ${data.statistiques.agents.avecMateriels}`);
      doc.text(`- Agents sans matériels: ${data.statistiques.agents.sansMateriels}`);
      doc.text(`- Bureaux total: ${data.statistiques.bureaux.total}`);
      doc.text(`- Bureaux occupés: ${data.statistiques.bureaux.occupes}`);
      doc.text(`- Bureaux vides: ${data.statistiques.bureaux.vides}`);
      doc.moveDown(1.5);

      // Pied de page
      doc
        .fontSize(10)
        .font('Helvetica-Oblique')
        .text(`Généré le ${new Date().toLocaleString('fr-FR')}`, { align: 'center' });

      doc.end();
    });
  }

  /**
   * Obtenir le nom du mois en français
   */
  private getMonthName(month: number): string {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
    ];
    return months[month - 1];
  }

  private getMouvementTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      AFFECTATION: 'Affectation',
      RETOUR: 'Retour au stock',
      TRANSFERT: 'Transfert',
      MAINTENANCE: 'Maintenance',
      REFORME: 'Réforme',
    };
    return labels[type] || type;
  }

  private getMaterielStatutLabel(statut: string): string {
    const labels: Record<string, string> = {
      EN_SERVICE: 'En service',
      EN_PANNE: 'En panne',
      EN_MAINTENANCE: 'En maintenance',
      EN_STOCK: 'En stock',
      REFORME: 'Réformé',
      PERDU: 'Perdu',
    };
    return labels[statut] || statut;
  }

  private formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }
}
