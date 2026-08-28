import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma.service';
import { LoginDto, RegisterDto } from './dto';
import { generateMatricule } from '../common/matricule.helper';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Générer le matricule automatiquement
    const matricule = await generateMatricule(
      this.prisma as any,
      registerDto.prenom,
      registerDto.nom,
    );

    // Créer l'utilisateur — le rôle est toujours USER via l'inscription publique
    const user = await this.prisma.user.create({
      data: {
        matricule,
        email: registerDto.email,
        password: hashedPassword,
        nom: registerDto.nom,
        prenom: registerDto.prenom,
        role: 'USER',
      },
    });

    const token = this.generateToken(user);

    return {
      message: 'Utilisateur créé avec succès',
      user: {
        id: user.id,
        matricule: (user as any).matricule,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    // Chercher par email OU par matricule
    const identifier = loginDto.identifier;
    const isEmail = identifier.includes('@');

    let user: any = null;

    if (isEmail) {
      user = await this.prisma.user.findUnique({
        where: { email: identifier },
      });
    } else {
      // Recherche par matricule (insensible à la casse)
      const results = await this.prisma.$queryRaw<any[]>`
        SELECT * FROM users WHERE UPPER(matricule) = UPPER(${identifier}) LIMIT 1
      `;
      user = results?.[0] ?? null;
    }

    if (!user) {
      throw new UnauthorizedException('Identifiant ou mot de passe incorrect');
    }

    if (!user.actif) {
      throw new UnauthorizedException('Compte désactivé. Contactez un administrateur.');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiant ou mot de passe incorrect');
    }

    const token = this.generateToken(user);

    return {
      message: 'Connexion réussie',
      user: {
        id: user.id,
        matricule: user.matricule,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
      },
      token,
    };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
        actif: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    return user;
  }

  private generateToken(user: any): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }
}
