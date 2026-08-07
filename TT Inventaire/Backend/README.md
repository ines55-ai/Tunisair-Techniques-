# IT Inventaire - Backend

## Description

Backend de l'application IT Inventaire pour Tunisair Technique, développé avec NestJS.

## Structure du Projet

```
src/
├── auth/                 # Module d'authentification
├── users/                # Gestion des utilisateurs
├── agents/               # Gestion des agents
├── bureaux/              # Gestion des bureaux
├── categories/           # Gestion des catégories
├── materiels/            # Gestion des matériels
├── mouvements/           # Gestion des mouvements
├── inventaires/          # Gestion des inventaires
├── antivirus/            # Gestion des antivirus
├── dashboard/            # Données du tableau de bord
├── rapports/             # Génération de rapports
├── common/               # Services partagés (Prisma, etc.)
├── config/               # Configuration de l'application
├── guards/               # Guards d'authentification
├── interceptors/         # Interceptors (logging, etc.)
├── middlewares/          # Middlewares personnalisés
├── decorators/           # Décorateurs personnalisés
└── filters/              # Filtres d'exception
```

## Prérequis

- Node.js (v18 ou supérieur)
- MySQL (v8 ou supérieur)
- npm ou yarn

## Installation

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Modifier le fichier .env avec vos informations
```

## Configuration de la Base de Données

1. Créer une base de données MySQL :
```sql
CREATE DATABASE it_inventaire;
```

2. Configurer le fichier `.env` :
```env
DATABASE_URL="mysql://username:password@localhost:3306/it_inventaire"
```

3. Générer le client Prisma :
```bash
npx prisma generate
```

4. Exécuter les migrations :
```bash
npx prisma migrate dev
```

## Démarrage

```bash
# Mode développement
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

L'application sera accessible sur `http://localhost:3000`

## Technologies Utilisées

- **NestJS** - Framework backend
- **Prisma** - ORM pour la base de données
- **MySQL** - Base de données
- **JWT** - Authentification
- **Passport** - Stratégies d'authentification
- **bcrypt** - Hashage des mots de passe
- **class-validator** - Validation des données
- **class-transformer** - Transformation des données

## Scripts Disponibles

```bash
# Démarrage en mode développement
npm run start:dev

# Build de production
npm run build

# Exécution des tests
npm run test

# Génération du client Prisma
npx prisma generate

# Migration de la base de données
npx prisma migrate dev

# Studio Prisma (interface graphique)
npx prisma studio
```

## API Documentation

L'API sera accessible à l'adresse : `http://localhost:3000`

Les endpoints seront organisés par modules :
- `/auth` - Authentification
- `/users` - Utilisateurs
- `/agents` - Agents
- `/bureaux` - Bureaux
- `/categories` - Catégories
- `/materiels` - Matériels
- `/mouvements` - Mouvements
- `/inventaires` - Inventaires
- `/antivirus` - Antivirus
- `/dashboard` - Dashboard
- `/rapports` - Rapports

## CORS

Le backend est configuré pour accepter les requêtes depuis :
- `http://localhost:5173` (Frontend React en développement)

Pour modifier l'origine CORS, éditer le fichier `.env` :
```env
CORS_ORIGIN="http://votre-domaine.com"
```

## Sécurité

- Validation automatique des données avec `class-validator`
- Authentification JWT
- Hashage des mots de passe avec bcrypt
- Guards pour protéger les routes
- Middleware de logging des requêtes

## Développé pour

**Tunisair Technique** - Gestion de l'inventaire informatique
