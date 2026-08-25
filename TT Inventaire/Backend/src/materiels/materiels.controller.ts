import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  Res,
  Req,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { MaterielsService } from './materiels.service';
import { CreateMaterielDto, UpdateMaterielDto } from './dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { BarcodeService } from './barcode.service';

@Controller('materiels')
@UseGuards(JwtAuthGuard)
export class MaterielsController {
  constructor(
    private readonly materielsService: MaterielsService,
    private readonly barcodeService: BarcodeService,
  ) {}

  @Post()
  create(@Body() createMaterielDto: CreateMaterielDto) {
    return this.materielsService.create(createMaterielDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.materielsService.findAll(pageNum, limitNum, search);
  }

  @Get('statistics')
  getStatistics() {
    return this.materielsService.getStatistics();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.materielsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMaterielDto: UpdateMaterielDto,
  ) {
    return this.materielsService.update(id, updateMaterielDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.materielsService.remove(id);
  }

  // Générer un code-barres pour un matériel
  @Get(':id/barcode')
  async getBarcode(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const materiel = await this.materielsService.findOne(id);
    const barcodeBuffer = await this.barcodeService.generateBarcode(
      materiel.numeroSerie,
    );

    res.setHeader('Content-Type', 'image/png');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=barcode-${materiel.numeroSerie}.png`,
    );
    res.send(barcodeBuffer);
  }

  // Générer un QR code pour un matériel
  @Get(':id/qrcode')
  async getQRCode(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const materiel = await this.materielsService.findOne(id);
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const qrUrl = `${baseUrl}/materiels/${materiel.id}`;
    const qrBuffer = await this.barcodeService.generateQRCode(qrUrl);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=qrcode-${materiel.numeroSerie}.png`,
    );
    res.send(qrBuffer);
  }

  // Générer une étiquette PDF pour un matériel
  @Get(':id/label')
  async getLabel(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const materiel = await this.materielsService.findOne(id);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const pdfDoc = await this.barcodeService.generateLabelPDF(
        materiel,
        frontendUrl,
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=etiquette-${materiel.numeroSerie}.pdf`,
      );

      pdfDoc.pipe(res);

      pdfDoc.on('error', (err) => {
        console.error('PDF generation error:', err);
        if (!res.headersSent) {
          res.status(500).json({
            message: "Erreur lors de la génération de l'étiquette",
            error: err.message,
          });
        }
      });
    } catch (error) {
      console.error('Error generating label:', error);
      if (!res.headersSent) {
        res.status(500).json({
          message: "Erreur lors de la génération de l'étiquette",
          error: error.message,
        });
      }
    }
  }

  // Générer une feuille d'étiquettes pour plusieurs matériels
  @Post('labels/batch')
  async getBatchLabels(
    @Body('ids') ids: number[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const materiels = await Promise.all(
        ids.map((id) => this.materielsService.findOne(id)),
      );
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const pdfDoc = await this.barcodeService.generateLabelsSheetPDF(
        materiels,
        frontendUrl,
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=etiquettes-${Date.now()}.pdf`,
      );

      pdfDoc.pipe(res);

      pdfDoc.on('error', (err) => {
        console.error('PDF generation error:', err);
        if (!res.headersSent) {
          res.status(500).json({
            message: 'Erreur lors de la génération des étiquettes',
            error: err.message,
          });
        }
      });
    } catch (error) {
      console.error('Error generating labels:', error);
      if (!res.headersSent) {
        res.status(500).json({
          message: 'Erreur lors de la génération des étiquettes',
          error: error.message,
        });
      }
    }
  }

  // Scanner un code (récupérer les infos depuis le numéro de série)
  @Get('scan/:numeroSerie')
  async scanBarcode(@Param('numeroSerie') numeroSerie: string) {
    return this.materielsService.findByNumeroSerie(numeroSerie);
  }
}
