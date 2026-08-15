'use client';

import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-6">
              <ShoppingCart className="h-6 w-6 text-primary" />
              QuickStore
            </Link>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Reset your password</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your email address and we will send you a link to reset your password.
            </p>
          </div>

          <ForgotPasswordForm />
        </div>
      </div>
      
      <div className="relative hidden w-full md:block bg-muted">
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 text-zinc-50 p-10">
          <div className="max-w-md space-y-4 text-center">
            <h3 className="text-2xl font-bold tracking-tight">Regain access instantly</h3>
            <p className="text-zinc-400">
              Don't worry if you've forgotten your password. We'll get you back into your account safely and securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
