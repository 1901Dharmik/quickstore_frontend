'use client';

import { useState } from 'react';
import { useForgotPassword } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    forgotPasswordMutation.mutate(email);
  };

  if (forgotPasswordMutation.isSuccess) {
    return (
      <div className="rounded-md bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
        <h3 className="font-semibold mb-2">Check your email</h3>
        <p>If an account exists with that email, we've sent instructions on how to reset your password.</p>
        <div className="mt-4 text-center">
          <Link href="/auth/login" className="font-medium hover:underline">
            Return to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {forgotPasswordMutation.isError && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {forgotPasswordMutation.error?.response?.data?.message || 'Something went wrong. Please try again.'}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={forgotPasswordMutation.isPending}
      >
        {forgotPasswordMutation.isPending ? 'Sending link...' : 'Send reset link'}
      </Button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Remember your password? </span>
        <Link href="/auth/login" className="font-medium text-primary hover:text-primary/90 hover:underline">
          Sign in
        </Link>
      </div>
    </form>
  );
}
