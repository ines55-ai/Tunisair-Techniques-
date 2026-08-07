import api from './api';

export const categorieService = {
  getAll: async () => {
    const response = await api.get('/categories');
    // Gérer la pagination backend
    return response.data.data || response.data || [];
  },

  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export default categorieService;
