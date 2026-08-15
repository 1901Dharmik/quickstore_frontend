'use client';

import { useUser } from '@/hooks/use-auth';
import { RegisterForm } from '@/components/auth/register-form';
import { RunningSeconds } from '@/components/ui/running-seconds';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const { user, loading: isUserLoading } = useUser();
  const router = useRouter();

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-5 bg-background px-4">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Already signed in as {user.email || user.name}
        </p>
        <button
          onClick={() => router.push('/shop')}
          className="inline-flex items-center gap-2 bg-foreground px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-80"
        >
          Go to Shop <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Panel side */}
      <div className="relative hidden md:flex md:flex-col md:items-center md:justify-center bg-foreground px-10">
        <div className="max-w-md space-y-4 text-center">
          <span className="block font-mono text-[11px] uppercase tracking-[0.3em] text-background/50">
            Join the collection
          </span>
          <h3 className="font-display text-4xl italic tracking-tight text-background">
            Join QuickStore today
          </h3>
          <p className="text-sm leading-relaxed text-background/60">
            Create an account to track your orders, save your favourite items, and access exclusive member-only offers.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="mb-10 inline-flex items-center gap-2.5">
            <RunningSeconds size={20} className="text-foreground" />
            <span className="font-display text-2xl italic tracking-tight text-foreground">QuickStore</span>
          </Link>
          <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            New account
          </span>
          <h2 className="font-display text-3xl italic tracking-tight text-foreground">
            Create an account
          </h2>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
