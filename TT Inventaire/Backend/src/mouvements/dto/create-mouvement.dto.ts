import { IsInt, IsEnum, IsOptional, IsString, IsDateString, IsNotEmpty, IsBoolean } from 'class-validator';

export enum TypeMouvement {
  AFFECTATION = 'AFFECTATION',
  RETOUR = 'RETOUR',
  TRANSFERT = 'TRANSFERT',
  MAINTENANCE = 'MAINTENANCE',
  REFORME = 'REFORME',
}

export class CreateMouvementDto {
  @IsInt()
  materielId: number;

  @IsEnum(TypeMouvement)
  typeMouvement: TypeMouvement;

  @IsInt()
  @IsOptional()
  agentSourceId?: number;

  @IsInt()
  @IsOptional()
  agentDestId?: number;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsDateString()
  @IsOptional()
  dateRetourPrevue?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  remarques?: string;

  @IsString()
  @IsOptional()
  effectuePar?: string;

  @IsBoolean()
  @IsOptional()
  cloture?: boolean;
}
