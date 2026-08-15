'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { placeOrder, submitUtr, fetchOrders, fetchOrder } from '@/api/order';
import { toast } from 'sonner';

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: placeOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed to place order.'),
  });
};

export const useSubmitUtr = () => {
  return useMutation({
    mutationFn: submitUtr,
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed to submit UTR.'),
  });
};

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await fetchOrders();
      return res?.data || [];
    },
  });
};

export const useOrder = (id) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const res = await fetchOrder(id);
      return res?.data;
    },
    enabled: !!id,
  });
};
