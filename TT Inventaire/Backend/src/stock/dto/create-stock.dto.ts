import { IsInt, IsOptional, IsString, IsEnum, IsDateString, Min } from 'class-validator';

export enum EtatStock {
  DISPONIBLE = 'DISPONIBLE',
  RESERVE = 'RESERVE',
  EN_COMMANDE = 'EN_COMMANDE',
  ENDOMMAGE = 'ENDOMMAGE',
}

export class CreateStockDto {
  @IsInt()
  materielId: number;

  @IsOptional()
  @IsDateString()
  dateArrivage?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantite?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  seuilAlerte?: number;

  @IsOptional()
  @IsString()
  emplacement?: string;

  @IsOptional()
  @IsEnum(EtatStock)
  etat?: EtatStock;

  @IsOptional()
  @IsString()
  remarques?: string;
}
