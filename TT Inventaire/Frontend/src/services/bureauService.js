import api from './api';

export const bureauService = {
  getAll: async () => {
    const response = await api.get('/bureaux');
    // Gérer la pagination backend
    return response.data.data || response.data || [];
  },

  getById: async (id) => {
    const response = await api.get(`/bureaux/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/bureaux', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/bureaux/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/bureaux/${id}`);
    return response.data;
  },
};

export default bureauService;
