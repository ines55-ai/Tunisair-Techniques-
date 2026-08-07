import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { MouvementsService } from './mouvements.service';
import { CreateMouvementDto, UpdateMouvementDto } from './dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('mouvements')
@UseGuards(JwtAuthGuard)
export class MouvementsController {
  constructor(private readonly mouvementsService: MouvementsService) {}

  @Post()
  create(@Body() createMouvementDto: CreateMouvementDto) {
    return this.mouvementsService.create(createMouvementDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('typeMouvement') typeMouvement?: string,
    @Query('materielId') materielId?: string,
    @Query('agentId') agentId?: string,
    @Query('dateDebut') dateDebut?: string,
    @Query('dateFin') dateFin?: string,
    @Query('enCours') enCours?: string,
  ) {
    const filters = {
      typeMouvement,
      materielId,
      agentId,
      dateDebut,
      dateFin,
      enCours: enCours ? enCours === 'true' : undefined,
    };
    
    return this.mouvementsService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      filters,
    );
  }

  @Get('statistics')
  getStatistics() {
    return this.mouvementsService.getStatistics();
  }

  @Get('materiel/:materielId')
  findByMateriel(@Param('materielId', ParseIntPipe) materielId: number) {
    return this.mouvementsService.findByMateriel(materielId);
  }

  @Get('agent/:agentId')
  findByAgent(@Param('agentId', ParseIntPipe) agentId: number) {
    return this.mouvementsService.findByAgent(agentId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mouvementsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMouvementDto: UpdateMouvementDto,
  ) {
    return this.mouvementsService.update(id, updateMouvementDto);
  }

  @Patch(':id/cloturer')
  cloturerMouvement(@Param('id', ParseIntPipe) id: number) {
    return this.mouvementsService.cloturerMouvement(id);
  }

  @Get(':id/pdf')
  async generatePDF(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const pdfDoc = await this.mouvementsService.generatePDF(id);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=mouvement-${id}.pdf`,
      );
      
      // Pipe the PDF to response
      pdfDoc.pipe(res);
      
      // Handle end event to ensure PDF is fully written
      pdfDoc.on('end', () => {
        res.end();
      });
      
      // Handle error event
      pdfDoc.on('error', (err) => {
        console.error('PDF generation error:', err);
        if (!res.headersSent) {
          res.status(500).json({ 
            message: 'Erreur lors de la génération du PDF',
            error: err.message 
          });
        }
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      if (!res.headersSent) {
        res.status(500).json({ 
          message: 'Erreur lors du téléchargement',
          error: error.message 
        });
      }
    }
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mouvementsService.remove(id);
  }
}
