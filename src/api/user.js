import api from '@/lib/axios';

export const userApi = {
  // Orders
  getOrders: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/orders${query ? `?${query}` : ''}`);
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Addresses
  getAddresses: async () => {
    const response = await api.get('/addresses');
    return response.data;
  },

  createAddress: async (data) => {
    const response = await api.post('/addresses', data);
    return response.data;
  },

  updateAddress: async (id, data) => {
    const response = await api.put(`/addresses/${id}`, data);
    return response.data;
  },

  deleteAddress: async (id) => {
    const response = await api.delete(`/addresses/${id}`);
    return response.data;
  },

  setDefaultAddress: async (id) => {
    const response = await api.patch(`/addresses/${id}/default`);
    return response.data;
  },
};
