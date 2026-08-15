import api from '@/lib/axios';

export const placeOrder = async (payload) => {
  const { data } = await api.post('/orders', payload);
  return data;
};

export const submitUtr = async ({ orderId, referenceNumber }) => {
  const { data } = await api.post(`/orders/${orderId}/submit-utr`, { referenceNumber });
  return data;
};

export const fetchOrders = async () => {
  const { data } = await api.get('/orders');
  return data;
};

export const fetchOrder = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};
