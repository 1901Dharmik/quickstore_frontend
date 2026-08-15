'use client';

import { useState } from 'react';
import { useResetPassword } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const resetPasswordMutation = useResetPassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!token) {
      setValidationError('Invalid or missing reset token.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }

    resetPasswordMutation.mutate({ token, password });
  };

  if (!token && !resetPasswordMutation.isError) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive text-center">
        <h3 className="font-semibold mb-2">Invalid Link</h3>
        <p>This password reset link is invalid or missing a token.</p>
        <div className="mt-4">
          <Link href="/auth/forgot-password" className="font-medium hover:underline">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {validationError && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {validationError}
        </div>
      )}
      
      {resetPasswordMutation.isError && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {resetPasswordMutation.error?.response?.data?.message || 'Failed to reset password. The link might be expired.'}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={resetPasswordMutation.isPending || !token}
      >
        {resetPasswordMutation.isPending ? 'Resetting password...' : 'Reset password'}
      </Button>
    </form>
  );
}