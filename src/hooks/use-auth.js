'use client';

import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { useMergeCart } from '@/hooks/use-cart';
import { saveTokens } from '@/lib/token';
import { toast } from 'sonner';

export const useUser = () => {
  return useAuthContext();
};

export const useLogin = () => {
  const { fetchProfile } = useAuthContext();
  const router = useRouter();
  const mergeCartMutation = useMergeCart();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      saveTokens(data.user || data);
      fetchProfile();
      mergeCartMutation.mutate();
      toast.success('Successfully signed in!');
      router.push('/'); 
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to sign in. Please check your credentials.');
    }
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success('Account created successfully! Please log in.');
      router.push('/auth/login'); 
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to register.');
    }
  });
};

export const useLogout = () => {
  const { logout } = useAuthContext();
  return { mutate: logout };
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success('Password reset email sent (if account exists).');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to send reset email.');
    }
  });
};

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success('Password reset successfully!');
      router.push('/auth/login?reset=success');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to reset password.');
    }
  });
};
