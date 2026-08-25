import api from './api';

const inventaireService = {
  // Récupérer tous les inventaires
  getAll: async () => {
    const response = await api.get('/inventaires');
    return response.data;
  },

  // Récupérer un inventaire par ID
  getById: async (id) => {
    const response = await api.get(`/inventaires/${id}`);
    return response.data;
  },

  // Créer un inventaire
  create: async (data) => {
    const response = await api.post('/inventaires', data);
    return response.data;
  },

  // Mettre à jour un inventaire
  update: async (id, data) => {
    const response = await api.patch(`/inventaires/${id}`, data);
    return response.data;
  },

  // Supprimer un inventaire
  delete: async (id) => {
    const response = await api.delete(`/inventaires/${id}`);
    return response.data;
  },

  // Clôturer un inventaire
  cloturer: async (id) => {
    const response = await api.post(`/inventaires/${id}/cloturer`);
    return response.data;
  },

  // Valider un inventaire
  valider: async (id) => {
    const response = await api.post(`/inventaires/${id}/valider`);
    return response.data;
  },

  // Annuler un inventaire
  annuler: async (id) => {
    const response = await api.post(`/inventaires/${id}/annuler`);
    return response.data;
  },

  // Mettre à jour une ligne d'inventaire
  updateLigne: async (id, ligneId, data) => {
    const response = await api.patch(`/inventaires/${id}/lignes/${ligneId}`, data);
    return response.data;
  },

  // Marquer un matériel comme trouvé
  marquerTrouve: async (id, ligneId) => {
    const response = await api.post(`/inventaires/${id}/lignes/${ligneId}/marquer-trouve`);
    return response.data;
  },

  // Récupérer les écarts
  getEcarts: async (id) => {
    const response = await api.get(`/inventaires/${id}/ecarts`);
    return response.data;
  },

  // Récupérer les statistiques
  getStatistiques: async () => {
    const response = await api.get('/inventaires/statistiques');
    return response.data;
  },
};

export default inventaireService;
