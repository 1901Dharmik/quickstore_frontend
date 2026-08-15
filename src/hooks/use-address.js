'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from '@/api/address';
import { toast } from 'sonner';

export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await fetchAddresses();
      return res?.data || [];
    },
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address saved.');
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed to save address.'),
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address updated.');
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed to update address.'),
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address deleted.');
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed to delete address.'),
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed to set default.'),
  });
};
