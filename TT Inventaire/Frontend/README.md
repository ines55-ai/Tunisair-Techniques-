# IT Inventaire - Frontend

## Description

Frontend de l'application IT Inventaire pour Tunisair Technique, développé avec React et Vite.

## Structure du Projet

```
src/
├── assets/           # Images, logos, fichiers statiques
├── components/       # Composants React réutilisables
│   ├── common/       # Composants communs (Buttons, Inputs, etc.)
│   ├── layout/       # Composants de mise en page (Header, Sidebar, etc.)
│   └── ui/           # Composants d'interface utilisateur
├── pages/            # Pages de l'application
│   ├── Login/        # Page de connexion
│   ├── Dashboard/    # Tableau de bord
│   ├── Materiels/    # Gestion des matériels
│   ├── Agents/       # Gestion des agents
│   ├── Bureaux/      # Gestion des bureaux
│   ├── Inventaires/  # Gestion des inventaires
│   ├── Mouvements/   # Gestion des mouvements
│   ├── Antivirus/    # Gestion des antivirus
│   ├── Rapports/     # Génération de rapports
│   └── NotFound/     # Page 404
├── services/         # Services API (axios)
├── hooks/            # Hooks personnalisés React
├── context/          # Contextes React (Auth, Theme, etc.)
├── routes/           # Configuration des routes
├── utils/            # Fonctions utilitaires et constantes
├── App.jsx           # Composant principal
└── main.jsx          # Point d'entrée de l'application
```

## Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn

## Installation

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Modifier le fichier .env si nécessaire
```

## Configuration

Le fichier `.env` contient la configuration de l'API :

```env
VITE_API_URL=http://localhost:3000
```

## Démarrage

```bash
# Mode développement
npm run dev

# Build de production
npm run build

# Prévisualiser le build de production
npm run preview
```

L'application sera accessible sur `http://localhost:5173`

## Technologies Utilisées

- **React** - Bibliothèque UI
- **Vite** - Build tool et dev server
- **React Router** - Navigation et routing
- **Material-UI (MUI)** - Composants UI
- **Axios** - Client HTTP pour les appels API
- **Emotion** - Styling des composants

## Structure des Pages

Toutes les pages suivent la même structure :

```jsx
pages/
└── PageName/
    ├── PageName.jsx    # Composant principal
    └── index.js        # Export du composant
```

## Routes Disponibles

- `/` - Tableau de bord
- `/login` - Page de connexion
- `/dashboard` - Tableau de bord
- `/materiels` - Gestion des matériels
- `/agents` - Gestion des agents
- `/bureaux` - Gestion des bureaux
- `/inventaires` - Gestion des inventaires
- `/mouvements` - Gestion des mouvements
- `/antivirus` - Gestion des antivirus
- `/rapports` - Génération de rapports
- `*` - Page 404

## Services API

Le fichier `services/api.js` contient la configuration Axios avec :

- Interceptor de requête pour ajouter le token JWT
- Interceptor de réponse pour gérer les erreurs d'authentification
- Configuration de l'URL de base de l'API

## Authentification

L'authentification est gérée par :

- `AuthContext` - Contexte React pour l'état d'authentification
- `authService` - Service pour les appels API d'authentification
- `useAuth` - Hook personnalisé pour accéder au contexte d'authentification

Le token JWT est stocké dans le localStorage.

## Hooks Personnalisés

- `useApi` - Hook pour gérer les appels API avec état de chargement et erreurs
- `useAuth` - Hook pour accéder à l'authentification

## Développé pour

**Tunisair Technique** - Gestion de l'inventaire informatique
