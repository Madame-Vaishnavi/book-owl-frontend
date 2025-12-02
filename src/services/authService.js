import api from './api';

export const authService = {
  registerUser: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }
};

