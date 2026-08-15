'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCart, addItemToCart, updateCartItem, removeCartItem, clearCart, mergeGuestCart } from '@/api/cart';
import { toast } from 'sonner';

export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      try {
        const response = await fetchCart();
        return response?.data || { items: [], total_items: 0, subtotal: 0 };
      } catch (err) {
        return { items: [], total_items: 0, subtotal: 0 };
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addItemToCart,
    onSuccess: (response) => {
      queryClient.setQueryData(['cart'], response.data);
      toast.success('Item added to cart!');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to add item to cart.');
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItem,
    onSuccess: (response) => {
      queryClient.setQueryData(['cart'], response.data);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update cart.');
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: (response) => {
      queryClient.setQueryData(['cart'], response.data);
      toast.success('Item removed from cart');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to remove item.');
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: (response) => {
      queryClient.setQueryData(['cart'], response.data);
      toast.success('Cart cleared successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to clear cart.');
    },
  });
};

export const useMergeCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mergeGuestCart,
    onSuccess: (response) => {
      queryClient.setQueryData(['cart'], response.data);
    },
    onError: (error) => {
      console.error('Failed to merge guest cart', error);
    },
  });
};
