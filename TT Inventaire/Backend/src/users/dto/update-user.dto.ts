import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from './create-user.dto';

export class UpdateUserDto {
  @IsEmail({}, { message: 'Email invalide' })
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  nom?: string;

  @IsString()
  @IsOptional()
  prenom?: string;

  @IsEnum(Role, { message: 'Rôle invalide (ADMIN, MANAGER ou USER)' })
  @IsOptional()
  role?: Role;

  @IsBoolean()
  @IsOptional()
  actif?: boolean;
}
