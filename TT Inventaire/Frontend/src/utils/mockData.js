/**
 * Données mockées pour tester l'interface sans backend
 * À utiliser temporairement pendant le développement
 */

export const mockMateriels = [
  {
    id: 1,
    numeroSerie: 'PC-2024-001',
    numeroInventaire: 'INV-001',
    nom: 'Dell Latitude 5520',
    marque: 'Dell',
    modele: 'Latitude 5520',
    categorieId: 1,
    statut: 'EN_SERVICE',
    dateAcquisition: '2024-01-15T00:00:00.000Z',
    garantieExpire: '2027-01-15T00:00:00.000Z',
    valeur: 3500,
    agentId: 1,
    bureauId: 1,
    description: 'Ordinateur portable pour développement',
    categorie: { id: 1, nom: 'Ordinateur Portable', code: 'PC' },
    agent: {
      id: 1,
      matricule: 'MAT001',
      nom: 'Benali',
      prenom: 'Ahmed',
      email: 'ahmed.benali@tunisair.com',
      poste: 'Développeur',
    },
    bureau: {
      id: 1,
      code: 'BUR-01',
      nom: 'Bureau Informatique',
      etage: '3',
      batiment: 'Bâtiment A',
    },
  },
  {
    id: 2,
    numeroSerie: 'ECR-2024-010',
    numeroInventaire: 'INV-010',
    nom: 'Dell 27" UltraSharp',
    marque: 'Dell',
    modele: 'U2720Q',
    categorieId: 2,
    statut: 'EN_STOCK',
    dateAcquisition: '2024-02-20T00:00:00.000Z',
    garantieExpire: '2027-02-20T00:00:00.000Z',
    valeur: 1200,
    agentId: null,
    bureauId: null,
    description: 'Écran 4K pour station de travail',
    categorie: { id: 2, nom: 'Écran', code: 'ECR' },
    agent: null,
    bureau: null,
  },
  {
    id: 3,
    numeroSerie: 'IMP-2024-005',
    numeroInventaire: 'INV-015',
    nom: 'HP LaserJet Pro',
    marque: 'HP',
    modele: 'LaserJet Pro M404dn',
    categorieId: 3,
    statut: 'EN_PANNE',
    dateAcquisition: '2023-11-10T00:00:00.000Z',
    garantieExpire: '2026-11-10T00:00:00.000Z',
    valeur: 800,
    agentId: 2,
    bureauId: 2,
    description: 'Imprimante réseau',
    categorie: { id: 3, nom: 'Imprimante', code: 'IMP' },
    agent: {
      id: 2,
      matricule: 'MAT002',
      nom: 'Trabelsi',
      prenom: 'Sonia',
      email: 'sonia.trabelsi@tunisair.com',
      poste: 'Assistante',
    },
    bureau: {
      id: 2,
      code: 'BUR-02',
      nom: 'Secrétariat',
      etage: '2',
      batiment: 'Bâtiment A',
    },
  },
];

export const mockMouvements = [
  {
    id: 1,
    materielId: 1,
    typeMouvement: 'AFFECTATION',
    agentSourceId: null,
    agentDestId: 1,
    date: '2024-01-20T10:30:00.000Z',
    description: 'Affectation initiale',
    remarques: 'Matériel neuf',
    effectuePar: 'Admin Système',
    cloture: false,
    materiel: {
      id: 1,
      nom: 'Dell Latitude 5520',
      numeroSerie: 'PC-2024-001',
    },
    agentSource: null,
    agentDest: {
      id: 1,
      nom: 'Benali',
      prenom: 'Ahmed',
      matricule: 'MAT001',
    },
  },
  {
    id: 2,
    materielId: 3,
    typeMouvement: 'TRANSFERT',
    agentSourceId: 3,
    agentDestId: 2,
    date: '2024-03-15T14:20:00.000Z',
    description: 'Changement de bureau',
    remarques: 'Réorganisation des services',
    effectuePar: 'Manager IT',
    cloture: false,
    materiel: {
      id: 3,
      nom: 'HP LaserJet Pro',
      numeroSerie: 'IMP-2024-005',
    },
    agentSource: {
      id: 3,
      nom: 'Hamdi',
      prenom: 'Mohamed',
      matricule: 'MAT003',
    },
    agentDest: {
      id: 2,
      nom: 'Trabelsi',
      prenom: 'Sonia',
      matricule: 'MAT002',
    },
  },
  {
    id: 3,
    materielId: 3,
    typeMouvement: 'MAINTENANCE',
    agentSourceId: 2,
    agentDestId: null,
    date: '2024-07-18T09:00:00.000Z',
    dateRetourPrevue: '2024-07-25T09:00:00.000Z',
    description: 'Maintenance préventive',
    remarques: 'Nettoyage et remplacement pièces',
    effectuePar: 'Technicien SAV',
    cloture: false,
    materiel: {
      id: 3,
      nom: 'HP LaserJet Pro',
      numeroSerie: 'IMP-2024-005',
    },
    agentSource: {
      id: 2,
      nom: 'Trabelsi',
      prenom: 'Sonia',
      matricule: 'MAT002',
    },
    agentDest: null,
  },
];

export const mockAgents = [
  {
    id: 1,
    matricule: 'MAT001',
    nom: 'Benali',
    prenom: 'Ahmed',
    email: 'ahmed.benali@tunisair.com',
    telephone: '+216 20 123 456',
    poste: 'Développeur',
    departement: 'IT',
    bureauId: 1,
    actif: true,
  },
  {
    id: 2,
    matricule: 'MAT002',
    nom: 'Trabelsi',
    prenom: 'Sonia',
    email: 'sonia.trabelsi@tunisair.com',
    telephone: '+216 20 234 567',
    poste: 'Assistante',
    departement: 'Administration',
    bureauId: 2,
    actif: true,
  },
  {
    id: 3,
    matricule: 'MAT003',
    nom: 'Hamdi',
    prenom: 'Mohamed',
    email: 'mohamed.hamdi@tunisair.com',
    telephone: '+216 20 345 678',
    poste: 'Manager',
    departement: 'IT',
    bureauId: 1,
    actif: true,
  },
];

export const mockBureaux = [
  {
    id: 1,
    code: 'BUR-01',
    nom: 'Bureau Informatique',
    etage: '3',
    batiment: 'Bâtiment A',
    capacite: 10,
    description: 'Bureau dédié à l\'équipe IT',
    actif: true,
  },
  {
    id: 2,
    code: 'BUR-02',
    nom: 'Secrétariat',
    etage: '2',
    batiment: 'Bâtiment A',
    capacite: 5,
    description: 'Bureau du secrétariat général',
    actif: true,
  },
  {
    id: 3,
    code: 'BUR-03',
    nom: 'Salle Serveurs',
    etage: 'RDC',
    batiment: 'Bâtiment B',
    capacite: 2,
    description: 'Salle des serveurs et équipements réseau',
    actif: true,
  },
];

export const mockDecharges = [
  {
    id: 1,
    numeroDocument: 'DECH-2024-001',
    dateGeneration: '2024-01-20T10:30:00.000Z',
    typeMouvement: 'AFFECTATION',
    mouvementId: 1,
    materiel: {
      id: 1,
      nom: 'Dell Latitude 5520',
      numeroSerie: 'PC-2024-001',
      numeroInventaire: 'INV-001',
    },
    ancienAgent: null,
    nouvelAgent: {
      id: 1,
      nom: 'Benali',
      prenom: 'Ahmed',
      matricule: 'MAT001',
    },
    ancienBureau: null,
    nouveauBureau: {
      id: 1,
      nom: 'Bureau Informatique',
      code: 'BUR-01',
    },
    cheminPDF: '/decharges/DECH-2024-001.pdf',
  },
  {
    id: 2,
    numeroDocument: 'DECH-2024-015',
    dateGeneration: '2024-03-15T14:20:00.000Z',
    typeMouvement: 'TRANSFERT',
    mouvementId: 2,
    materiel: {
      id: 3,
      nom: 'HP LaserJet Pro',
      numeroSerie: 'IMP-2024-005',
      numeroInventaire: 'INV-015',
    },
    ancienAgent: {
      id: 3,
      nom: 'Hamdi',
      prenom: 'Mohamed',
      matricule: 'MAT003',
    },
    nouvelAgent: {
      id: 2,
      nom: 'Trabelsi',
      prenom: 'Sonia',
      matricule: 'MAT002',
    },
    ancienBureau: {
      id: 1,
      nom: 'Bureau Informatique',
      code: 'BUR-01',
    },
    nouveauBureau: {
      id: 2,
      nom: 'Secrétariat',
      code: 'BUR-02',
    },
    cheminPDF: '/decharges/DECH-2024-015.pdf',
  },
];

export const mockDashboardStats = {
  statistics: {
    materiels: {
      total: 150,
      affectes: 120,
      libres: 20,
      enService: 130,
      enPanne: 8,
      enMaintenance: 7,
      enStock: 5,
    },
    agents: 45,
    bureaux: 12,
    categories: 8,
    mouvements: {
      transfertsMois: 15,
      affectationsJour: 3,
    },
  },
  recentMateriels: mockMateriels,
  materielsByCategorie: [
    { nom: 'Ordinateur Portable', count: 45 },
    { nom: 'Écran', count: 60 },
    { nom: 'Imprimante', count: 15 },
    { nom: 'Clavier/Souris', count: 20 },
    { nom: 'Autre', count: 10 },
  ],
};

/**
 * Helper pour simuler un délai réseau
 */
export const simulateNetworkDelay = (ms = 500) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Helper pour créer une réponse paginée
 */
export const createPaginatedResponse = (data, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    pagination: {
      total: data.length,
      page,
      limit,
      totalPages: Math.ceil(data.length / limit),
    },
  };
};

/**
 * Exemple d'utilisation dans un service
 * 
 * import { mockMateriels, simulateNetworkDelay } from '../utils/mockData';
 * 
 * export const materielService = {
 *   getAll: async () => {
 *     await simulateNetworkDelay(300);
 *     return { data: mockMateriels };
 *   },
 * };
 */
