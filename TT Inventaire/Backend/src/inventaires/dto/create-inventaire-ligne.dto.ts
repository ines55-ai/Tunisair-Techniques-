import { IsInt, IsBoolean, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateInventaireLigneDto {
  @IsInt()
  inventaireId: number;

  @IsInt()
  materielId: number;

  @IsBoolean()
  @IsOptional()
  trouve?: boolean;

  @IsString()
  @IsOptional()
  etat?: string;

  @IsString()
  @IsOptional()
  remarques?: string;

  @IsDateString()
  @IsOptional()
  dateVerif?: string;

  @IsString()
  @IsOptional()
  verifPar?: string;
}
