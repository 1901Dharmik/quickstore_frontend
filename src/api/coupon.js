import api from '@/lib/axios';

export const validateCoupon = async ({ code, items, userId, guestId }) => {
  const { data } = await api.post('/coupons/validate', { code, items, userId, guestId });
  return data;
};
