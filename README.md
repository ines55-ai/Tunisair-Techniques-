# TT Inventaire — Système de gestion des inventaires informatiques

> Application web complète de gestion du parc informatique pour **Tunisair Technics**.  
> Développée avec **NestJS** (Backend) et **React + MUI** (Frontend).

---

## Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Structure du projet](#structure-du-projet)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Lancer l'application](#lancer-lapplication)
- [Comptes par défaut](#comptes-par-défaut)
- [API – Endpoints principaux](#api--endpoints-principaux)
- [Accessibilité](#accessibilité)
- [Scripts disponibles](#scripts-disponibles)

---

## Aperçu

TT Inventaire permet aux équipes informatiques de Tunisair Technics de :

- Suivre l'ensemble du **parc matériel** (PCs, imprimantes, serveurs, téléphones, réseau…)
- Gérer les **affectations, transferts et maintenances**
- Effectuer des **inventaires périodiques**
- Gérer le **stock** de matériels non affectés
- Générer des **rapports PDF** et des **étiquettes QR code / code-barres**
- Administrer les **utilisateurs** avec gestion des rôles (Admin / Manager / Technicien)

---

## Fonctionnalités

| Module | Description |
|---|---|
| **Tableau de bord** | Vue d'ensemble statistique du parc en temps réel |
| **Matériels** | CRUD complet, pagination, recherche, affectation, transfert |
| **Agents** | Gestion des employés et de leurs équipements |
| **Bureaux** | Gestion des localisations et des salles |
| **Stock** | Suivi des matériels disponibles avec alertes de seuil |
| **Inventaires** | Sessions d'inventaire avec suivi de progression |
| **Mouvements** | Historique de tous les mouvements avec export PDF |
| **Antivirus** | Suivi des licences antivirus (expiration, renouvellement) |
| **Rapports** | Rapport mensuel exportable en PDF |
| **Scanner** | Scan QR code / code-barres via la caméra |
| **Utilisateurs** | Gestion des comptes (admin uniquement) |
| **Profil** | Modification du profil et du mot de passe |

---

## Stack technique

### Backend
| Technologie | Version | Rôle |
|---|---|---|
| [NestJS](https://nestjs.com/) | ^11.0 | Framework Node.js |
| [Prisma ORM](https://www.prisma.io/) | ^6.9 | ORM / migrations |
| MySQL | 8+ | Base de données |
| JWT + Passport | — | Authentification |
| PDFKit | ^0.19 | Génération PDF |
| bwip-js | ^4.11 | Génération QR/codes-barres |

### Frontend
| Technologie | Version | Rôle |
|---|---|---|
| [React](https://react.dev/) | ^19.2 | UI Library |
| [Vite](https://vitejs.dev/) | ^8.1 | Build tool |
| [MUI](https://mui.com/) | ^9.2 | Composants UI |
| React Router DOM | ^7.18 | Routing |
| Axios | ^1.18 | Client HTTP |
| html5-qrcode | ^2.3 | Scanner caméra |

---

## Structure du projet

```
Tunisair-Techniques-/
└── TT Inventaire/
    ├── Backend/               # API NestJS
    │   ├── prisma/
    │   │   ├── schema.prisma  # Modèles de données
    │   │   ├── seed.ts        # Données de démonstration
    │   │   └── migrations/    # Historique des migrations
    │   └── src/
    │       ├── auth/          # Authentification JWT
    │       ├── agents/        # Module agents
    │       ├── bureaux/       # Module bureaux
    │       ├── categories/    # Module catégories
    │       ├── materiels/     # Module matériels
    │       ├── mouvements/    # Module mouvements
    │       ├── inventaires/   # Module inventaires
    │       ├── stock/         # Module stock
    │       ├── antivirus/     # Module antivirus
    │       ├── dashboard/     # Statistiques
    │       ├── rapports/      # Export PDF
    │       └── users/         # Gestion utilisateurs
    └── Frontend/              # SPA React
        └── src/
            ├── components/    # Composants réutilisables
            ├── context/       # AuthContext, ThemeContext
            ├── pages/         # Pages de l'application
            ├── services/      # Appels API (axios)
            ├── hooks/         # Hooks personnalisés
            └── utils/         # Constantes et helpers
```

---

## Prérequis

- **Node.js** ≥ 20
- **npm** ≥ 10
- **MySQL** ≥ 8 (ou XAMPP)
- **Git**

---

## Installation

### 1. Cloner le dépôt

```bash
git clone <url-du-depot>
cd "Tunisair-Techniques-/TT Inventaire"
```

### 2. Installer les dépendances Backend

```bash
cd Backend
npm install
```

### 3. Installer les dépendances Frontend

```bash
cd ../Frontend
npm install
```

---

## Configuration

### Backend — fichier `.env`

Copier le fichier d'exemple et l'adapter :

```bash
cd Backend
cp .env.example .env
```

Contenu minimal du `.env` :

```env
# Base de données
DATABASE_URL="mysql://root:@localhost:3306/it_inventaire"

# JWT
JWT_SECRET="change-this-secret-in-production"
JWT_EXPIRATION="24h"

# Serveur
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:5173"
FRONTEND_URL="http://localhost:5173"
```

> **Note :** Sur XAMPP, MySQL tourne par défaut avec `root` sans mot de passe.

### Base de données

Créer la base puis appliquer les migrations :

```bash
# Créer la base (si elle n'existe pas)
mysql -u root -e "CREATE DATABASE IF NOT EXISTS it_inventaire CHARACTER SET utf8mb4;"

# Appliquer les migrations
cd Backend
npx prisma migrate deploy

# Générer le client Prisma
npx prisma generate
```

---

## Lancer l'application

### Backend (mode développement)

```bash
cd Backend
npm run start:dev
```

> API disponible sur **http://localhost:3000**

### Frontend (mode développement)

```bash
cd Frontend
npm run dev
```

> Interface disponible sur **http://localhost:5173**

### Peupler la base de données (optionnel)

```bash
cd Backend
npx ts-node -r tsconfig-paths/register --project tsconfig.json \
  -e "require('dotenv').config(); require('./prisma/seed.ts')"
```

---

## Comptes par défaut

> Disponibles après exécution du seed.

| Rôle | Email | Mot de passe |
|---|---|---|
| Administrateur | `admin@tunisair.tn` | `Admin123!` |
| Technicien | `mohamed.ben.ali@tunisair.tn` | `Admin123!` |

---

## API – Endpoints principaux

| Méthode | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/login` | Connexion |
| `POST` | `/auth/register` | Inscription |
| `GET` | `/dashboard/statistics` | Statistiques globales |
| `GET/POST` | `/materiels` | Liste / Création matériels |
| `GET/PATCH/DELETE` | `/materiels/:id` | Détail / Modification / Suppression |
| `GET/POST` | `/agents` | Liste / Création agents |
| `GET/POST` | `/mouvements` | Liste / Création mouvements |
| `GET` | `/mouvements/:id/pdf` | Export PDF d'un mouvement |
| `GET/POST` | `/inventaires` | Liste / Création inventaires |
| `GET/POST` | `/stock` | Liste / Ajout au stock |
| `GET` | `/rapports/mensuel/pdf` | Rapport mensuel PDF |
| `GET/POST` | `/utilisateurs` | Gestion des comptes (admin) |

---

## Accessibilité

L'application respecte les critères **WCAG 2.1 AA** :

- ♿ **Panneau d'accessibilité** (icône dans la barre de navigation) :
  - Taille de texte : Par défaut / Grand / Très grand
  - Mode contraste élevé
  - Persistance des préférences dans `localStorage`
- ⌨️ **Navigation au clavier** complète avec skip link
- 🔊 **Lecteurs d'écran** : `aria-label`, `aria-current`, `aria-live`, `role="status"`
- 🎭 **`prefers-reduced-motion`** : animations désactivées si demandé
- 🎨 **Contraste des couleurs** : ratios ≥ 4.5:1 (WCAG AA) sur tous les éléments interactifs
- 🌙 **Mode sombre** persistant

---

## Scripts disponibles

### Backend

```bash
npm run start        # Production
npm run start:dev    # Développement (watch)
npm run build        # Compilation TypeScript
npm run lint         # ESLint
npx prisma studio    # Interface visuelle Prisma
npx prisma generate  # Régénérer le client Prisma
```

### Frontend

```bash
npm run dev          # Développement (Vite)
npm run build        # Build de production
npm run preview      # Prévisualiser le build
npm run lint         # ESLint
```

---

## Licence

Projet interne — **Tunisair Technics**. Tous droits réservés.
