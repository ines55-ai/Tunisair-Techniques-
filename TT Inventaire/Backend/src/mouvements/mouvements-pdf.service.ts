import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { TypeMouvement } from '@prisma/client';
import { addPdfBrandHeader } from '../common/pdf-branding.util';

@Injectable()
export class MouvementsPdfService {
  generateMouvementPDF(mouvement: any): PDFKit.PDFDocument {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });

    // En-tête
    this.addHeader(doc, mouvement);

    // Informations du mouvement
    this.addMouvementDetails(doc, mouvement);

    // Synthèse métier du mouvement
    this.addOperationSummary(doc, mouvement);

    // Informations du matériel
    this.addMaterielDetails(doc, mouvement);

    // Agents (source et destination)
    this.addAgentDetails(doc, mouvement);

    // Description et remarques
    this.addDescriptionSection(doc, mouvement);

    // Pied de page
    this.addFooter(doc, mouvement);

    // IMPORTANT: Finaliser le document
    doc.end();
    
    return doc;
  }

  private addHeader(doc: PDFKit.PDFDocument, mouvement: any) {
    const typeLabels = {
      AFFECTATION: 'RAPPORT D\'AFFECTATION',
      RETOUR: 'RAPPORT DE RETOUR',
      TRANSFERT: 'RAPPORT DE TRANSFERT',
      MAINTENANCE: 'RAPPORT DE MAINTENANCE',
      REFORME: 'RAPPORT DE RÉFORME',
    };

    const title = typeLabels[mouvement.typeMouvement] || 'RAPPORT DE MOUVEMENT';
    const subtitle = `Référence #${mouvement.id.toString().padStart(6, '0')} • ${new Date().toLocaleString('fr-FR')}`;

    doc.y = addPdfBrandHeader(doc, title, subtitle);
    doc.moveDown(1);
  }

  private addMouvementDetails(doc: PDFKit.PDFDocument, mouvement: any) {
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Informations du Mouvement', 50, doc.y);

    doc.moveDown(0.5);

    const startY = doc.y;

    // Cadre
    doc
      .rect(50, startY, 495, 100)
      .fillAndStroke('#f5f5f5', '#cccccc')
      .fillColor('#000000');

    doc.y = startY + 10;

    // Contenu
    doc.fontSize(11).font('Helvetica');

    const details = [
      { label: 'Référence:', value: `#${mouvement.id.toString().padStart(6, '0')}` },
      { label: 'Type de mouvement:', value: this.getTypeLabel(mouvement.typeMouvement) },
      { label: 'Date:', value: new Date(mouvement.date).toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) },
      { label: 'Statut:', value: mouvement.cloture ? 'Terminé' : 'En cours' },
      {
        label: 'Date retour prévue:',
        value: mouvement.dateRetourPrevue
          ? new Date(mouvement.dateRetourPrevue).toLocaleDateString('fr-FR')
          : 'N/A',
      },
    ];

    details.forEach((detail, index) => {
      const y = startY + 12 + (index * 16);
      doc
        .font('Helvetica-Bold')
        .text(detail.label, 60, y, { width: 150, continued: true })
        .font('Helvetica')
        .text(detail.value);
    });

    doc.y = startY + 100;
    doc.moveDown(1);
  }

  private addOperationSummary(doc: PDFKit.PDFDocument, mouvement: any) {
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Synthèse de l\'opération', 50, doc.y);

    doc.moveDown(0.5);

    const startY = doc.y;
    doc
      .rect(50, startY, 495, 70)
      .fillAndStroke('#eef7ff', '#90caf9')
      .fillColor('#000000');

    const sourceName = mouvement.agentSource
      ? `${mouvement.agentSource.nom} ${mouvement.agentSource.prenom}`
      : 'N/A';
    const destName = mouvement.agentDest
      ? `${mouvement.agentDest.nom} ${mouvement.agentDest.prenom}`
      : 'N/A';
    const materielName = mouvement.materiel?.nom || 'Matériel';

    let sentence = `${this.getTypeLabel(mouvement.typeMouvement)} enregistré.`;

    if (mouvement.typeMouvement === 'AFFECTATION') {
      sentence = `${materielName} affecté à ${destName}.`;
    } else if (mouvement.typeMouvement === 'TRANSFERT') {
      sentence = `${materielName} transféré de ${sourceName} vers ${destName}.`;
    } else if (mouvement.typeMouvement === 'RETOUR') {
      sentence = `${materielName} retourné au stock depuis ${sourceName}.`;
    } else if (mouvement.typeMouvement === 'MAINTENANCE') {
      sentence = `${materielName} envoyé en maintenance.`;
    } else if (mouvement.typeMouvement === 'REFORME') {
      sentence = `${materielName} marqué en réforme.`;
    }

    doc
      .fontSize(11)
      .font('Helvetica')
      .text(sentence, 65, startY + 15, { width: 465, align: 'left' });

    if (mouvement.dateRetourPrevue) {
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Date retour prévue: ', 65, startY + 40, { continued: true })
        .font('Helvetica')
        .text(new Date(mouvement.dateRetourPrevue).toLocaleDateString('fr-FR'));
    }

    doc.y = startY + 80;
    doc.moveDown(1);
  }

  private addMaterielDetails(doc: PDFKit.PDFDocument, mouvement: any) {
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Matériel Concerné', 50, doc.y);

    doc.moveDown(0.5);

    const startY = doc.y;

    // Cadre
    doc
      .rect(50, startY, 495, 120)
      .fillAndStroke('#e3f2fd', '#2196f3')
      .fillColor('#000000');

    doc.y = startY + 10;

    // Contenu
    doc.fontSize(11).font('Helvetica');

    const materielDetails = [
      { label: 'Numéro de série:', value: mouvement.materiel?.numeroSerie || 'N/A' },
      { label: 'Désignation:', value: mouvement.materiel?.nom || 'N/A' },
      { label: 'Marque:', value: mouvement.materiel?.marque || 'N/A' },
      { label: 'Modèle:', value: mouvement.materiel?.modele || 'N/A' },
      { label: 'Catégorie:', value: mouvement.materiel?.categorie?.nom || 'N/A' },
      { label: 'Statut:', value: mouvement.materiel?.statut || 'N/A' },
    ];

    materielDetails.forEach((detail, index) => {
      const y = startY + 15 + (index * 17);
      doc
        .font('Helvetica-Bold')
        .text(detail.label, 60, y, { width: 150, continued: true })
        .font('Helvetica')
        .text(detail.value);
    });

    doc.y = startY + 130;
    doc.moveDown(1);
  }

  private addAgentDetails(doc: PDFKit.PDFDocument, mouvement: any) {
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Agents', 50, doc.y);

    doc.moveDown(0.5);

    const startY = doc.y;
    let boxHeight = 80;

    // Calculer la hauteur en fonction du type de mouvement
    if (mouvement.typeMouvement === 'TRANSFERT') {
      boxHeight = 120;
    }

    // Cadre
    doc
      .rect(50, startY, 495, boxHeight)
      .fillAndStroke('#fff3e0', '#ff9800')
      .fillColor('#000000');

    doc.y = startY + 10;

    // Contenu
    doc.fontSize(11).font('Helvetica');

    if (mouvement.typeMouvement === 'AFFECTATION') {
      // Seulement agent destination
      if (mouvement.agentDest) {
        doc
          .font('Helvetica-Bold')
          .text('Agent destinataire:', 60, doc.y)
          .font('Helvetica')
          .text(`${mouvement.agentDest.matricule} - ${mouvement.agentDest.nom} ${mouvement.agentDest.prenom}`, 60, doc.y + 15)
          .text(`Email: ${mouvement.agentDest.email || 'N/A'}`, 60, doc.y + 30)
          .text(`Poste: ${mouvement.agentDest.poste || 'N/A'}`, 60, doc.y + 45);
      }
    } else if (mouvement.typeMouvement === 'RETOUR') {
      // Seulement agent source
      if (mouvement.agentSource) {
        doc
          .font('Helvetica-Bold')
          .text('Agent source:', 60, doc.y)
          .font('Helvetica')
          .text(`${mouvement.agentSource.matricule} - ${mouvement.agentSource.nom} ${mouvement.agentSource.prenom}`, 60, doc.y + 15)
          .text(`Email: ${mouvement.agentSource.email || 'N/A'}`, 60, doc.y + 30)
          .text(`Poste: ${mouvement.agentSource.poste || 'N/A'}`, 60, doc.y + 45);
      }
    } else if (mouvement.typeMouvement === 'TRANSFERT') {
      // Source et destination côte à côte
      const leftCol = 60;
      const rightCol = 305;
      const contentY = startY + 15;

      // Agent Source
      doc
        .font('Helvetica-Bold')
        .text('DE:', leftCol, contentY);
      
      if (mouvement.agentSource) {
        doc
          .font('Helvetica')
          .fontSize(10)
          .text(`${mouvement.agentSource.matricule}`, leftCol, contentY + 15)
          .text(`${mouvement.agentSource.nom} ${mouvement.agentSource.prenom}`, leftCol, contentY + 28)
          .text(`${mouvement.agentSource.poste || 'N/A'}`, leftCol, contentY + 41);
      }

      // Flèche
      doc
        .fontSize(20)
        .text('→', 270, contentY + 25);

      // Agent Destination
      doc
        .font('Helvetica-Bold')
        .fontSize(11)
        .text('À:', rightCol, contentY);
      
      if (mouvement.agentDest) {
        doc
          .font('Helvetica')
          .fontSize(10)
          .text(`${mouvement.agentDest.matricule}`, rightCol, contentY + 15)
          .text(`${mouvement.agentDest.nom} ${mouvement.agentDest.prenom}`, rightCol, contentY + 28)
          .text(`${mouvement.agentDest.poste || 'N/A'}`, rightCol, contentY + 41);
      }
    }

    doc.y = startY + boxHeight + 10;
    doc.moveDown(1);
  }

  private addDescriptionSection(doc: PDFKit.PDFDocument, mouvement: any) {
    if (mouvement.description || mouvement.remarques) {
      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('Détails Additionnels', 50, doc.y);

      doc.moveDown(0.5);

      if (mouvement.description) {
        doc
          .fontSize(11)
          .font('Helvetica-Bold')
          .text('Description:', 50, doc.y)
          .font('Helvetica')
          .text(mouvement.description, 50, doc.y + 15, {
            width: 495,
            align: 'justify',
          });

        doc.moveDown(1);
      }

      if (mouvement.remarques) {
        doc
          .fontSize(11)
          .font('Helvetica-Bold')
          .text('Remarques:', 50, doc.y)
          .font('Helvetica')
          .text(mouvement.remarques, 50, doc.y + 15, {
            width: 495,
            align: 'justify',
          });

        doc.moveDown(1);
      }
    }

    // Date de retour prévue si applicable
    if (mouvement.dateRetourPrevue) {
      doc.moveDown(1);
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Date de retour prévue: ', 50, doc.y, { continued: true })
        .font('Helvetica')
        .text(new Date(mouvement.dateRetourPrevue).toLocaleDateString('fr-FR'));
    }

    // Effectué par
    if (mouvement.effectuePar) {
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Validé par: ', 50, doc.y + 15, { continued: true })
        .font('Helvetica')
        .text(mouvement.effectuePar);
    }
  }

  private addFooter(doc: PDFKit.PDFDocument, mouvement: any) {
    const footerY = 700;

    // Ligne de séparation
    doc
      .moveTo(50, footerY)
      .lineTo(545, footerY)
      .strokeColor('#cccccc')
      .lineWidth(1)
      .stroke();

    doc.moveDown(1);

    // Section Signatures
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#000000')
      .text('Signatures et Approbations', 50, footerY + 15, { align: 'center' });

    doc.moveDown(0.5);

    const signatureY = footerY + 45;
    const col1X = 60;
    const col2X = 230;
    const col3X = 400;

    // Signature Agent Source
    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .text('Agent Source', col1X, signatureY, { width: 140, align: 'center' });
    
    if (mouvement.agentSource) {
      doc
        .fontSize(8)
        .font('Helvetica')
        .text(
          `${mouvement.agentSource.nom} ${mouvement.agentSource.prenom}`,
          col1X,
          signatureY + 15,
          { width: 140, align: 'center' }
        );
    }

    // Ligne de signature Agent Source
    doc
      .moveTo(col1X + 10, signatureY + 60)
      .lineTo(col1X + 130, signatureY + 60)
      .strokeColor('#000000')
      .lineWidth(1)
      .stroke();

    doc
      .fontSize(7)
      .fillColor('#666666')
      .text('Signature', col1X, signatureY + 65, { width: 140, align: 'center' });

    // Signature Agent Destination
    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor('#000000')
      .text('Agent Destination', col2X, signatureY, { width: 140, align: 'center' });
    
    if (mouvement.agentDest) {
      doc
        .fontSize(8)
        .font('Helvetica')
        .text(
          `${mouvement.agentDest.nom} ${mouvement.agentDest.prenom}`,
          col2X,
          signatureY + 15,
          { width: 140, align: 'center' }
        );
    }

    // Ligne de signature Agent Destination
    doc
      .moveTo(col2X + 10, signatureY + 60)
      .lineTo(col2X + 130, signatureY + 60)
      .strokeColor('#000000')
      .lineWidth(1)
      .stroke();

    doc
      .fontSize(7)
      .fillColor('#666666')
      .text('Signature', col2X, signatureY + 65, { width: 140, align: 'center' });

    // Signature Directeur
    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor('#000000')
      .text('Directeur', col3X, signatureY, { width: 140, align: 'center' });
    
    doc
      .fontSize(8)
      .font('Helvetica')
      .text('Direction IT', col3X, signatureY + 15, { width: 140, align: 'center' });

    // Ligne de signature Directeur
    doc
      .moveTo(col3X + 10, signatureY + 60)
      .lineTo(col3X + 130, signatureY + 60)
      .strokeColor('#000000')
      .lineWidth(1)
      .stroke();

    doc
      .fontSize(7)
      .fillColor('#666666')
      .text('Signature et Cachet', col3X, signatureY + 65, { width: 140, align: 'center' });

    // Information de génération
    doc
      .fontSize(8)
      .font('Helvetica')
      .fillColor('#999999')
      .text(
        `Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`,
        50,
        signatureY + 90,
        { align: 'center' }
      );

    // Avertissement légal
    doc
      .fontSize(7)
      .fillColor('#999999')
      .text(
        'Ce document est officiel et doit être conservé dans les archives de Tunisair Technique',
        50,
        signatureY + 105,
        { align: 'center', width: 495 }
      );
  }

  private getTypeLabel(type: TypeMouvement): string {
    const labels = {
      AFFECTATION: 'Affectation',
      RETOUR: 'Retour au stock',
      TRANSFERT: 'Transfert',
      MAINTENANCE: 'Maintenance',
      REFORME: 'Réforme',
    };
    return labels[type] || type;
  }
}
