import api from '@/lib/axios';

export const fetchAddresses = async () => {
  const { data } = await api.get('/addresses');
  return data;
};

export const createAddress = async (payload) => {
  const { data } = await api.post('/addresses', payload);
  return data;
};

export const updateAddress = async ({ id, ...payload }) => {
  const { data } = await api.put(`/addresses/${id}`, payload);
  return data;
};

export const deleteAddress = async (id) => {
  const { data } = await api.delete(`/addresses/${id}`);
  return data;
};

export const setDefaultAddress = async (id) => {
  const { data } = await api.patch(`/addresses/${id}/default`);
  return data;
};
