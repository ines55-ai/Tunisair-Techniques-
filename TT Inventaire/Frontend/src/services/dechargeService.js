import api from './api';

export const dechargeService = {
  /**
   * Récupérer toutes les décharges
   */
  getAll: async (page = 1, limit = 10, search = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
    });
    
    const response = await api.get(`/decharges?${params}`);
    return response.data;
  },

  /**
   * Récupérer une décharge par ID
   */
  getById: async (id) => {
    const response = await api.get(`/decharges/${id}`);
    return response.data;
  },

  /**
   * Récupérer les décharges d'un mouvement
   */
  getByMouvement: async (mouvementId) => {
    const response = await api.get(`/decharges/mouvement/${mouvementId}`);
    return response.data;
  },

  /**
   * Générer une décharge PDF
   */
  generate: async (mouvementId) => {
    const response = await api.post(`/decharges/generate/${mouvementId}`, {}, {
      responseType: 'blob', // Pour recevoir un fichier PDF
    });
    return response.data;
  },

  /**
   * Télécharger une décharge PDF
   */
  download: async (id) => {
    const response = await api.get(`/decharges/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Visualiser une décharge PDF (ouvre dans un nouvel onglet)
   */
  view: async (id) => {
    const response = await api.get(`/decharges/${id}/view`, {
      responseType: 'blob',
    });
    
    // Créer une URL pour le blob et l'ouvrir
    const file = new Blob([response], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank');
  },

  /**
   * Supprimer une décharge (Admin uniquement)
   */
  delete: async (id) => {
    const response = await api.delete(`/decharges/${id}`);
    return response.data;
  },
};

export default dechargeService;
