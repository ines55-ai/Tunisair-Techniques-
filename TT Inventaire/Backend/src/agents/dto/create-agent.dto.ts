import { IsString, IsNotEmpty, IsOptional, IsInt, IsEmail, IsIP } from 'class-validator';

export class CreateAgentDto {
  @IsString()
  @IsNotEmpty()
  matricule: string;

  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  prenom: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  telephone?: string;

  @IsString()
  @IsOptional()
  poste?: string;

  @IsString()
  @IsOptional()
  departement?: string;

  @IsIP()
  @IsOptional()
  adresseIP?: string;

  @IsInt()
  @IsOptional()
  bureauId?: number;
}
