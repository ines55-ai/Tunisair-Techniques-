import api from './api';

export const userService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/users', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },

  toggleActif: async (id) => {
    const response = await api.patch(`/users/${id}/toggle-actif`);
    return response.data;
  },

  resetPassword: async (id, password) => {
    const response = await api.patch(`/users/${id}/reset-password`, { password });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export default userService;
