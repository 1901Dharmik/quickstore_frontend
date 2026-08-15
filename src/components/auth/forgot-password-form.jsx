'use client';

import { useState } from 'react';
import { useForgotPassword } from '@/hooks/use-auth';
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
      <div className="rounded-[12px] bg-[#fafafa] p-6 text-center">
        <h3 className="mb-2 font-sans text-[16px] font-medium text-black">Check your email</h3>
        <p className="font-sans text-[14px] text-[#737373]">
          If an account exists with that email, we've sent instructions on how to reset your password.
        </p>
        <div className="mt-6">
          <Link href="/auth/login" className="font-sans text-[14px] font-medium text-black transition-opacity hover:opacity-70">
            Return to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {forgotPasswordMutation.isError && (
        <div className="rounded-[8px] bg-red-50 p-4 text-center font-sans text-[14px] text-red-600">
          {forgotPasswordMutation.error?.response?.data?.message || 'Something went wrong. Please try again.'}
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="mb-2 block font-sans text-[14px] text-black">
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          placeholder="name@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={forgotPasswordMutation.isPending}
          className="h-12 w-full rounded-[12px] border border-[#e5e5e5] bg-white px-4 font-sans text-[14px] text-black placeholder:text-[#a3a3a3] focus:border-black focus:outline-none disabled:opacity-50 transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={forgotPasswordMutation.isPending}
        className="flex h-12 w-full items-center justify-center rounded-full bg-black px-6 font-sans text-[14px] font-medium text-white transition-opacity hover:bg-[#090909] disabled:opacity-50"
      >
        {forgotPasswordMutation.isPending ? 'Sending link...' : 'Send reset link'}
      </button>

      <div className="text-center font-sans text-[14px] text-[#737373]">
        Remember your password?{' '}
        <Link href="/auth/login" className="font-medium text-black transition-opacity hover:opacity-70">
          Login
        </Link>
      </div>
    </form>
  );
}
