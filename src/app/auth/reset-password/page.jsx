import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="relative hidden w-full md:block bg-muted">
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 text-zinc-50 p-10">
          <div className="max-w-md space-y-4 text-center">
            <h3 className="text-2xl font-bold tracking-tight">Secure your account</h3>
            <p className="text-zinc-400">
              Create a strong new password to protect your QuickStore account. Make sure it's unique and memorable to you.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-6">
              <ShoppingCart className="h-6 w-6 text-primary" />
              QuickStore
            </Link>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Set new password</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Please enter your new password below.
            </p>
          </div>

          <Suspense fallback={<div className="text-center py-4">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
