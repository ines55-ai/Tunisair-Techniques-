import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  /**
   * Peut être un email (contient @) ou un matricule (ex: SA001)
   */
  @IsString({ message: 'Identifiant invalide' })
  @IsNotEmpty({ message: 'Email ou matricule requis' })
  identifier: string;

  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Mot de passe requis' })
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;
}
