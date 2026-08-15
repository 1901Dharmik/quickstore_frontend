import api from '@/lib/axios';

export const fetchCart = async () => {
  const { data } = await api.get('/cart');
  return data;
};

export const addItemToCart = async ({ product_id, variant_id, quantity = 1 }) => {
  const { data } = await api.post('/cart/items', { product_id, variant_id, quantity });
  return data;
};

export const updateCartItem = async ({ itemId, quantity }) => {
  const { data } = await api.put(`/cart/items/${itemId}`, { quantity });
  return data;
};

export const removeCartItem = async (itemId) => {
  const { data } = await api.delete(`/cart/items/${itemId}`);
  return data;
};

export const clearCart = async () => {
  const { data } = await api.delete('/cart');
  return data;
};

export const mergeGuestCart = async () => {
  const { data } = await api.post('/cart/merge');
  return data;
};
