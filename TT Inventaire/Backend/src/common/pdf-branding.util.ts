import * as fs from 'fs';
import * as path from 'path';

const LOGO_FILE = 'logo-tunisair-technics.png';

export function getLogoPath(): string | null {
  const candidates = [
    path.join(process.cwd(), 'assets', LOGO_FILE),
    path.join(process.cwd(), 'Backend', 'assets', LOGO_FILE),
    path.join(process.cwd(), 'backend', 'assets', LOGO_FILE),
    path.join(__dirname, '..', '..', 'assets', LOGO_FILE),
    path.join(process.cwd(), 'dist', 'assets', LOGO_FILE),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

export function addPdfBrandHeader(
  doc: PDFKit.PDFDocument,
  title: string,
  subtitle?: string,
): number {
  const logoPath = getLogoPath();
  const margin = 50;
  const contentWidth = 495;
  let currentY = 35;

  if (logoPath) {
    const logoWidth = 240;
    const logoHeight = 105;
    const logoX = margin + (contentWidth - logoWidth) / 2;

    doc.image(logoPath, logoX, currentY, {
      fit: [logoWidth, logoHeight],
      align: 'center',
      valign: 'center',
    });

    currentY += logoHeight + 18;
  } else {
    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .fillColor('#1976d2')
      .text('TUNISAIR TECHNICS', margin, currentY, {
        align: 'center',
        width: contentWidth,
      })
      .fillColor('#000000');

    currentY += 28;
  }

  doc
    .fontSize(18)
    .font('Helvetica-Bold')
    .fillColor('#1976d2')
    .text(title, margin, currentY, { align: 'center', width: contentWidth })
    .fillColor('#000000');

  currentY += 24;

  if (subtitle) {
    doc
      .fontSize(11)
      .font('Helvetica')
      .text(subtitle, margin, currentY, { align: 'center', width: contentWidth });
    currentY += 18;
  }

  doc
    .moveTo(margin, currentY + 8)
    .lineTo(margin + contentWidth, currentY + 8)
    .strokeColor('#1976d2')
    .lineWidth(1.5)
    .stroke();

  return currentY + 22;
}
