'use client';

import { useUser } from '@/hooks/use-auth';
import { RegisterForm } from '@/components/auth/register-form';
import { RunningSeconds } from '@/components/ui/running-seconds';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const { user, loading: isUserLoading } = useUser();
  const router = useRouter();

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#e5e5e5] border-t-black" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-5 bg-white px-4">
        <p className="font-sans text-[16px] text-[#737373]">
          Already signed in as <span className="font-medium text-black">{user.email || user.name}</span>
        </p>
        <button
          onClick={() => router.push('/shop')}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-black px-8 font-sans text-[14px] font-medium text-white transition-opacity hover:opacity-80"
        >
          Go to Shop <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-16 sm:px-10">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center text-center">
          <Link href="/" className="mb-8 flex items-center justify-center gap-2">
            <Image src="https://cdn.quickstore88.com/quickstore/quickstore_log1.png" alt="QuickStore Icon" width={32} height={32} className="object-contain" />
            <Image src="https://cdn.quickstore88.com/quickstore/quickstore_log2.png" alt="QuickStore" width={140} height={32} className="object-contain" />
          </Link>
          <h2 className="font-sans text-[28px] font-medium text-black">
            Create an account
          </h2>
          <p className="mt-2 font-sans text-[14px] text-[#737373]">
            Join QuickStore to track your orders and save items.
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
