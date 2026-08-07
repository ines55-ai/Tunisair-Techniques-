import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategorieDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsOptional()
  description?: string;
}
