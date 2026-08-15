import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/api/user';
import { toast } from 'sonner';

export const useOrders = (params = {}) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => userApi.getOrders(params),
  });
};

export const useOrder = (id) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => userApi.getOrderById(id),
    enabled: !!id,
  });
};

export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: userApi.getAddresses,
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address added successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add address');
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => userApi.updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update address');
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete address');
    },
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.setDefaultAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Default address updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to set default address');
    },
  });
};


