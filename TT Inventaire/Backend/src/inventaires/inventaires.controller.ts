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
} from '@nestjs/common';
import { InventairesService } from './inventaires.service';
import { CreateInventaireDto, UpdateInventaireDto, UpdateInventaireLigneDto } from './dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('inventaires')
@UseGuards(JwtAuthGuard)
export class InventairesController {
  constructor(private readonly inventairesService: InventairesService) {}

  @Post()
  create(@Body() createInventaireDto: CreateInventaireDto) {
    return this.inventairesService.create(createInventaireDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('statut') statut?: string,
    @Query('responsable') responsable?: string,
    @Query('dateDebut') dateDebut?: string,
  ) {
    const filters = { statut, responsable, dateDebut };
    return this.inventairesService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      filters,
    );
  }

  @Get('statistics')
  getStatistics() {
    return this.inventairesService.getStatistics();
  }

  @Get('statistiques')
  getStatistiques() {
    return this.inventairesService.getStatistics();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inventairesService.findOne(id);
  }

  @Get(':id/ecarts')
  getEcarts(@Param('id', ParseIntPipe) id: number) {
    return this.inventairesService.getEcarts(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInventaireDto: UpdateInventaireDto,
  ) {
    return this.inventairesService.update(id, updateInventaireDto);
  }

  @Post(':id/cloturer')
  cloturer(@Param('id', ParseIntPipe) id: number) {
    return this.inventairesService.cloturerInventaire(id);
  }

  @Post(':id/valider')
  valider(@Param('id', ParseIntPipe) id: number) {
    return this.inventairesService.validerInventaire(id);
  }

  @Post(':id/annuler')
  annuler(@Param('id', ParseIntPipe) id: number, @Body('motif') motif: string) {
    return this.inventairesService.annulerInventaire(id, motif || 'Annulation manuelle');
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inventairesService.remove(id);
  }

  // Lignes
  @Patch(':id/lignes/:ligneId')
  updateLigne(
    @Param('id', ParseIntPipe) id: number,
    @Param('ligneId', ParseIntPipe) ligneId: number,
    @Body() updateLigneDto: UpdateInventaireLigneDto,
  ) {
    return this.inventairesService.updateLigne(ligneId, updateLigneDto);
  }

  @Post(':id/lignes/:ligneId/marquer-trouve')
  marquerTrouve(
    @Param('id', ParseIntPipe) id: number,
    @Param('ligneId', ParseIntPipe) ligneId: number,
    @Body('etat') etat?: string,
    @Body('verifPar') verifPar?: string,
    @Body('remarques') remarques?: string,
  ) {
    return this.inventairesService.marquerTrouve(
      ligneId,
      etat || 'Bon',
      verifPar || 'Système',
      remarques,
    );
  }
}
