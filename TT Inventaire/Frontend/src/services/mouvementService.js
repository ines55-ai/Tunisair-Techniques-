import api from './api';

export const mouvementService = {
  getAll: async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    
    const response = await api.get(`/mouvements?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/mouvements/${id}`);
    return response.data;
  },

  getByMateriel: async (materielId) => {
    const response = await api.get(`/mouvements/materiel/${materielId}`);
    return response.data;
  },

  getByAgent: async (agentId) => {
    const response = await api.get(`/mouvements/agent/${agentId}`);
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/mouvements/statistics');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/mouvements', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/mouvements/${id}`, data);
    return response.data;
  },

  cloturer: async (id) => {
    const response = await api.patch(`/mouvements/${id}/cloturer`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/mouvements/${id}`);
    return response.data;
  },

  downloadPDF: async (id) => {
    const response = await api.get(`/mouvements/${id}/pdf`, {
      responseType: 'blob',
    });
    
    // Créer un lien pour télécharger le fichier
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mouvement-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return response.data;
  },
};

export default mouvementService;
