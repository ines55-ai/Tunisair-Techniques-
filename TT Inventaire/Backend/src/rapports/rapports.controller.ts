import { Controller, Get, Query, Res, UseGuards, ParseIntPipe } from '@nestjs/common';
import type { Response } from 'express';
import { RapportsService } from './rapports.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('rapports')
@UseGuards(JwtAuthGuard)
export class RapportsController {
  constructor(private readonly rapportsService: RapportsService) {}

  @Get('mensuel')
  async getMonthlyReport(
    @Query('annee', ParseIntPipe) annee: number,
    @Query('mois', ParseIntPipe) mois: number,
  ) {
    return this.rapportsService.generateMonthlyReport(annee, mois);
  }

  @Get('mensuel/pdf')
  async downloadMonthlyReportPDF(
    @Query('annee', ParseIntPipe) annee: number,
    @Query('mois', ParseIntPipe) mois: number,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.rapportsService.generatePDF(annee, mois);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=rapport-${annee}-${mois}.pdf`,
      'Content-Length': pdfBuffer.length,
    });
    
    res.end(pdfBuffer);
  }
}
