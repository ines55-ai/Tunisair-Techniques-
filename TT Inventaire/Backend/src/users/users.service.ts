import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { generateMatricule } from '../common/matricule.helper';

// Champs retournés (jamais le mot de passe)
const USER_SELECT = {
  id: true,
  matricule: true,
  email: true,
  nom: true,
  prenom: true,
  role: true,
  actif: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Lister tous les utilisateurs
  async findAll() {
    return this.prisma.user.findMany({
      select: USER_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Récupérer un utilisateur par ID
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: USER_SELECT,
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur #${id} introuvable`);
    }

    return user;
  }

  // Créer un utilisateur (par l'admin)
  async create(createUserDto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existing) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Générer le matricule automatiquement
    const matricule = await generateMatricule(
      this.prisma as any,
      createUserDto.prenom,
      createUserDto.nom,
    );

    const user = await this.prisma.user.create({
      data: {
        matricule,
        email: createUserDto.email,
        password: hashedPassword,
        nom: createUserDto.nom,
        prenom: createUserDto.prenom,
        role: createUserDto.role ?? 'USER',
      },
      select: USER_SELECT,
    });

    return {
      message: 'Utilisateur créé avec succès',
      user,
    };
  }

  // Mettre à jour un utilisateur
  async update(id: number, updateUserDto: UpdateUserDto, currentUserId: number) {
    await this.findOne(id);

    if (updateUserDto.email) {
      const emailTaken = await this.prisma.user.findFirst({
        where: { email: updateUserDto.email, NOT: { id } },
      });
      if (emailTaken) {
        throw new ConflictException('Cet email est déjà utilisé');
      }
    }

    const data: any = { ...updateUserDto };

    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data,
      select: USER_SELECT,
    });

    return {
      message: 'Utilisateur mis à jour avec succès',
      user: updated,
    };
  }

  // Activer / désactiver un compte
  async toggleActif(id: number, currentUserId: number) {
    const user = await this.findOne(id);

    if (id === currentUserId) {
      throw new BadRequestException('Vous ne pouvez pas désactiver votre propre compte');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: { actif: !user.actif },
      select: USER_SELECT,
    });

    return {
      message: updated.actif ? 'Compte activé' : 'Compte désactivé',
      user: updated,
    };
  }

  // Supprimer un utilisateur
  async remove(id: number, currentUserId: number) {
    await this.findOne(id);

    if (id === currentUserId) {
      throw new BadRequestException('Vous ne pouvez pas supprimer votre propre compte');
    }

    await this.prisma.user.delete({ where: { id } });

    return { message: 'Utilisateur supprimé avec succès' };
  }

  // Réinitialiser le mot de passe (admin)
  async resetPassword(id: number, newPassword: string) {
    await this.findOne(id);

    if (!newPassword || newPassword.length < 6) {
      throw new BadRequestException('Le mot de passe doit contenir au moins 6 caractères');
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id },
      data: { password: hashed },
    });

    return { message: 'Mot de passe réinitialisé avec succès' };
  }
}
