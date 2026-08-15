'use client';

import { useState } from 'react';
import { useLogin } from '@/hooks/use-auth';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleAuthButton } from '@/components/auth/google-auth-button';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
          disabled={loginMutation.isPending}
          className="h-12 w-full rounded-[12px] border border-[#e5e5e5] bg-white px-4 font-sans text-[14px] text-black placeholder:text-[#a3a3a3] focus:border-black focus:outline-none disabled:opacity-50 transition-colors"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="password" className="block font-sans text-[14px] text-black">
            Password
          </label>
          <Link href="/auth/forgot-password" className="font-sans text-[12px] font-medium text-[#737373] transition-colors hover:text-black">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loginMutation.isPending}
            className="h-12 w-full rounded-[12px] border border-[#e5e5e5] bg-white px-4 pr-11 font-sans text-[14px] text-black placeholder:text-[#a3a3a3] focus:border-black focus:outline-none disabled:opacity-50 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            disabled={loginMutation.isPending}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a3a3a3] transition-colors hover:text-black"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="flex h-12 w-full items-center justify-center rounded-full bg-black px-6 font-sans text-[14px] font-medium text-white transition-opacity hover:bg-[#090909] disabled:opacity-50"
      >
        {loginMutation.isPending ? 'Logging in…' : 'Login'}
      </button>

      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-[#e5e5e5]"></div>
        <span className="mx-4 flex-shrink-0 font-sans text-[12px] font-medium text-[#a3a3a3]">OR</span>
        <div className="flex-grow border-t border-[#e5e5e5]"></div>
      </div>

      <GoogleAuthButton />

      <p className="text-center font-sans text-[14px] text-[#737373]">
        Don't have an account?{' '}
        <Link href="/auth/register" className="font-medium text-black transition-opacity hover:opacity-70">
          Register
        </Link>
      </p>
    </form>
  );
}
