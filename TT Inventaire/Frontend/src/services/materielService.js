import api from './api';

export const materielService = {
  // Récupérer tous les matériels avec pagination
  getAll: async (page = 1, limit = 100, search = '') => {
    const response = await api.get('/materiels', {
      params: { page, limit, search },
    });
    // Si limit est élevé (>=100), retourner juste le tableau pour les formulaires
    // Sinon, retourner la structure complète pour la pagination
    if (limit >= 100) {
      return response.data.data || response.data || [];
    }
    // Pour la pagination, retourner {data, meta}
    return response.data;
  },

  // Récupérer un matériel par ID
  getById: async (id) => {
    const response = await api.get(`/materiels/${id}`);
    return response.data;
  },

  // Créer un nouveau matériel
  create: async (data) => {
    const response = await api.post('/materiels', data);
    return response.data;
  },

  // Mettre à jour un matériel
  update: async (id, data) => {
    const response = await api.patch(`/materiels/${id}`, data);
    return response.data;
  },

  // Supprimer un matériel (soft delete)
  delete: async (id) => {
    const response = await api.delete(`/materiels/${id}`);
    return response.data;
  },

  // Statistiques
  getStatistics: async () => {
    const response = await api.get('/materiels/statistics');
    return response.data;
  },
};

export default materielService;
