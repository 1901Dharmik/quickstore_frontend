'use client';

import { useState } from 'react';
import { useLogin } from '@/hooks/use-auth';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

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
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
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
          className="w-full border border-border bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground disabled:opacity-50"
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Password
          </label>
          <Link href="/auth/forgot-password" className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground">
            Forgot?
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
            className="w-full border border-border bg-background px-4 py-3 pr-11 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            disabled={loginMutation.isPending}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full bg-foreground px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="text-center font-mono text-[11px] text-muted-foreground">
        No account?{' '}
        <Link href="/auth/register" className="text-foreground underline underline-offset-4 transition-opacity hover:opacity-60">
          Sign up
        </Link>
      </p>
    </form>
  );
}
