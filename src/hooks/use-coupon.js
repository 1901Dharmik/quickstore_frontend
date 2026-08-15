import { useMutation } from '@tanstack/react-query';
import { validateCoupon } from '@/api/coupon';
import { toast } from 'sonner';

export function useValidateCoupon() {
  return useMutation({
    mutationFn: validateCoupon,
    onError: (err) => {
      const msg = err?.response?.data?.message || 'Invalid coupon code.';
      toast.error(msg);
    },
  });
}
