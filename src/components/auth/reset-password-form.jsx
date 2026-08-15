'use client';

import { useState } from 'react';
import { useResetPassword } from '@/hooks/use-auth';
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
      <div className="rounded-[8px] bg-red-50 p-4 text-center">
        <h3 className="mb-2 font-sans text-[16px] font-medium text-red-600">Invalid Link</h3>
        <p className="font-sans text-[14px] text-red-600">This password reset link is invalid or missing a token.</p>
        <div className="mt-4">
          <Link href="/auth/forgot-password" className="font-sans text-[14px] font-medium text-red-700 transition-opacity hover:opacity-70">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {validationError && (
        <div className="rounded-[8px] bg-red-50 p-4 text-center font-sans text-[14px] text-red-600">
          {validationError}
        </div>
      )}
      
      {resetPasswordMutation.isError && (
        <div className="rounded-[8px] bg-red-50 p-4 text-center font-sans text-[14px] text-red-600">
          {resetPasswordMutation.error?.response?.data?.message || 'Failed to reset password. The link might be expired.'}
        </div>
      )}
      
      <div>
        <label htmlFor="password" className="mb-2 block font-sans text-[14px] text-black">
          New Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={resetPasswordMutation.isPending}
            className="h-12 w-full rounded-[12px] border border-[#e5e5e5] bg-white px-4 pr-11 font-sans text-[14px] text-black placeholder:text-[#a3a3a3] focus:border-black focus:outline-none disabled:opacity-50 transition-colors"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a3a3a3] transition-colors hover:text-black"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="confirm-password" className="mb-2 block font-sans text-[14px] text-black">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            id="confirm-password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={resetPasswordMutation.isPending}
            className="h-12 w-full rounded-[12px] border border-[#e5e5e5] bg-white px-4 pr-11 font-sans text-[14px] text-black placeholder:text-[#a3a3a3] focus:border-black focus:outline-none disabled:opacity-50 transition-colors"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a3a3a3] transition-colors hover:text-black"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={resetPasswordMutation.isPending || !token}
        className="flex h-12 w-full items-center justify-center rounded-full bg-black px-6 font-sans text-[14px] font-medium text-white transition-opacity hover:bg-[#090909] disabled:opacity-50"
      >
        {resetPasswordMutation.isPending ? 'Resetting password...' : 'Reset password'}
      </button>
    </form>
  );
}