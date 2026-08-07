import api from './api';

export const stockService = {
  getAll: async () => {
    const response = await api.get('/stock');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/stock/${id}`);
    return response.data;
  },

  getByMaterielId: async (materielId) => {
    const response = await api.get(`/stock/materiel/${materielId}`);
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/stock/statistics');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/stock', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/stock/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/stock/${id}`);
    return response.data;
  },
};

export default stockService;
