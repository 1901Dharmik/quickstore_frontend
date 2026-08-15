import api from '@/lib/axios';

export const authApi = {
  // Login with email and password
  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    if (data?.token) {
      localStorage.setItem('auth_token', data.token);
    }
    return data; 
  },

  // Register a new user
  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  // Logout current user
  logout: async () => {
    const { data } = await api.post('/auth/logout');
    localStorage.removeItem('auth_token');
    return data;
  },

  // Fetch the currently authenticated user's profile
  getCurrentUser: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  // Send a forgot password email
  forgotPassword: async (email) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },

  // Reset password using a token
  resetPassword: async ({ token, password }) => {
    const { data } = await api.post('/auth/reset-password', { token, password });
    return data;
  },
};
