import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsEnum,
  IsNumber,
  IsDateString,
} from 'class-validator';

enum StatutMateriel {
  EN_SERVICE = 'EN_SERVICE',
  EN_PANNE = 'EN_PANNE',
  EN_MAINTENANCE = 'EN_MAINTENANCE',
  EN_STOCK = 'EN_STOCK',
  REFORME = 'REFORME',
  PERDU = 'PERDU',
}

export class CreateMaterielDto {
  @IsString()
  @IsNotEmpty()
  numeroSerie: string;

  @IsString()
  @IsOptional()
  numeroInventaire?: string;

  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsOptional()
  marque?: string;

  @IsString()
  @IsOptional()
  modele?: string;

  @IsInt()
  @IsNotEmpty()
  categorieId: number;

  @IsEnum(StatutMateriel)
  @IsOptional()
  statut?: StatutMateriel;

  @IsDateString()
  @IsOptional()
  dateAcquisition?: string;

  @IsDateString()
  @IsOptional()
  garantieExpire?: string;

  @IsNumber()
  @IsOptional()
  valeur?: number;

  @IsInt()
  @IsOptional()
  agentId?: number;

  @IsInt()
  @IsOptional()
  bureauId?: number;

  @IsString()
  @IsOptional()
  description?: string;
}
