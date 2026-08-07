import { IsString, IsNotEmpty, IsOptional, IsDateString, IsArray, IsInt, IsEnum } from 'class-validator';

export enum StatutInventaire {
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE',
  VALIDE = 'VALIDE',
  ANNULE = 'ANNULE',
}

export enum PerimetreType {
  TOUS = 'TOUS',
  CATEGORIE = 'CATEGORIE',
  BUREAU = 'BUREAU',
  AGENT = 'AGENT',
  STATUT = 'STATUT',
}

export class CreateInventaireDto {
  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsDateString()
  @IsOptional()
  dateDebut?: string;

  @IsDateString()
  @IsOptional()
  dateFin?: string;

  @IsString()
  @IsNotEmpty()
  responsable: string;

  @IsString()
  @IsOptional()
  remarques?: string;

  // Périmètre
  @IsEnum(PerimetreType)
  @IsOptional()
  perimetreType?: PerimetreType;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  perimetreIds?: number[]; // IDs des catégories, bureaux, agents ou statuts selon le type
}
