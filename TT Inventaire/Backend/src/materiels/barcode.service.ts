import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as bwipjs from 'bwip-js';
import * as QRCode from 'qrcode';

@Injectable()
export class BarcodeService {
  /**
   * Génère un code-barres au format Code128
   */
  async generateBarcode(text: string): Promise<Buffer> {
    try {
      const png = await bwipjs.toBuffer({
        bcid: 'code128',
        text: text,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: 'center',
      });
      return png;
    } catch (error) {
      throw new Error(`Erreur lors de la génération du code-barres: ${error.message}`);
    }
  }

  /**
   * Génère un QR code
   */
  async generateQRCode(data: string): Promise<Buffer> {
    try {
      const qrBuffer = await QRCode.toBuffer(data, {
        errorCorrectionLevel: 'H',
        type: 'png',
        width: 200,
        margin: 1,
      });
      return qrBuffer;
    } catch (error) {
      throw new Error(`Erreur lors de la génération du QR code: ${error.message}`);
    }
  }

  /**
   * Génère une étiquette PDF pour un matériel
   */
  async generateLabelPDF(materiel: any, baseUrl: string): Promise<PDFKit.PDFDocument> {
    const doc = new PDFDocument({
      size: [283.46, 141.73], // 100mm x 50mm en points (1mm = 2.83465 points)
      margins: { top: 14, bottom: 14, left: 14, right: 14 },
    });

    // Générer le code-barres et le QR code
    const barcodeBuffer = await this.generateBarcode(materiel.numeroSerie);
    const qrCodeUrl = `${baseUrl}/materiels/${materiel.id}`;
    const qrBuffer = await this.generateQRCode(qrCodeUrl);

    // En-tête
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Tunisair Technique', 14, 14, { width: 255.46, align: 'center' });

    // QR Code (à gauche)
    doc.image(qrBuffer, 14, 35, { width: 70, height: 70 });

    // Informations du matériel (au centre)
    const infoX = 94;
    let infoY = 35;

    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .text('N° Série:', infoX, infoY);
    doc
      .font('Helvetica')
      .text(materiel.numeroSerie, infoX + 45, infoY);

    infoY += 12;
    doc
      .font('Helvetica-Bold')
      .text('Matériel:', infoX, infoY);
    doc
      .font('Helvetica')
      .text(materiel.nom, infoX + 45, infoY, { width: 140, height: 20 });

    infoY += 20;
    doc
      .font('Helvetica-Bold')
      .text('Marque:', infoX, infoY);
    doc
      .font('Helvetica')
      .text(materiel.marque || 'N/A', infoX + 45, infoY);

    infoY += 12;
    doc
      .font('Helvetica-Bold')
      .text('Modèle:', infoX, infoY);
    doc
      .font('Helvetica')
      .text(materiel.modele || 'N/A', infoX + 45, infoY);

    // Code-barres (en bas)
    doc.image(barcodeBuffer, 14, 105, { width: 255.46, height: 25 });

    doc.end();
    return doc;
  }

  /**
   * Génère une feuille A4 avec plusieurs étiquettes
   */
  async generateLabelsSheetPDF(materiels: any[], baseUrl: string): Promise<PDFKit.PDFDocument> {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 28.35, bottom: 28.35, left: 28.35, right: 28.35 },
    });

    const labelWidth = 283.46; // 100mm
    const labelHeight = 141.73; // 50mm
    const cols = 2;
    const rows = 5;
    const spacingX = 14.17; // 5mm
    const spacingY = 14.17; // 5mm

    let currentCol = 0;
    let currentRow = 0;

    for (const materiel of materiels) {
      if (currentRow >= rows) {
        doc.addPage();
        currentRow = 0;
        currentCol = 0;
      }

      const x = 28.35 + currentCol * (labelWidth + spacingX);
      const y = 28.35 + currentRow * (labelHeight + spacingY);

      // Dessiner le cadre de l'étiquette
      doc.rect(x, y, labelWidth, labelHeight).stroke('#cccccc');

      // Générer le code-barres et le QR code
      const barcodeBuffer = await this.generateBarcode(materiel.numeroSerie);
      const qrCodeUrl = `${baseUrl}/materiels/${materiel.id}`;
      const qrBuffer = await this.generateQRCode(qrCodeUrl);

      // En-tête
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('#000000')
        .text('Tunisair Technique', x, y + 10, { width: labelWidth, align: 'center' });

      // QR Code
      doc.image(qrBuffer, x + 10, y + 30, { width: 60, height: 60 });

      // Informations
      const infoX = x + 80;
      let infoY = y + 30;

      doc
        .fontSize(7)
        .font('Helvetica-Bold')
        .text('N° Série:', infoX, infoY, { width: 40 });
      doc
        .font('Helvetica')
        .text(materiel.numeroSerie, infoX + 40, infoY, { width: 130 });

      infoY += 10;
      doc
        .font('Helvetica-Bold')
        .text('Matériel:', infoX, infoY, { width: 40 });
      doc
        .font('Helvetica')
        .text(materiel.nom, infoX + 40, infoY, { width: 130, height: 18 });

      infoY += 18;
      doc
        .font('Helvetica-Bold')
        .text('Marque:', infoX, infoY, { width: 40 });
      doc
        .font('Helvetica')
        .text(materiel.marque || 'N/A', infoX + 40, infoY, { width: 130 });

      infoY += 10;
      doc
        .font('Helvetica-Bold')
        .text('Modèle:', infoX, infoY, { width: 40 });
      doc
        .font('Helvetica')
        .text(materiel.modele || 'N/A', infoX + 40, infoY, { width: 130 });

      // Code-barres
      doc.image(barcodeBuffer, x + 10, y + 95, { width: labelWidth - 20, height: 35 });

      currentCol++;
      if (currentCol >= cols) {
        currentCol = 0;
        currentRow++;
      }
    }

    doc.end();
    return doc;
  }
}
