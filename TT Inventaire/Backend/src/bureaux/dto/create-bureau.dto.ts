import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBureauDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsOptional()
  etage?: string;

  @IsString()
  @IsOptional()
  batiment?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
