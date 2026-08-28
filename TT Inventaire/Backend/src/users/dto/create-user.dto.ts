import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
}

export class CreateUserDto {
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'Email requis' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Mot de passe requis' })
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Nom requis' })
  nom: string;

  @IsString()
  @IsNotEmpty({ message: 'Prénom requis' })
  prenom: string;

  @IsEnum(Role, { message: 'Rôle invalide (ADMIN, MANAGER ou USER)' })
  @IsOptional()
  role?: Role;
}
