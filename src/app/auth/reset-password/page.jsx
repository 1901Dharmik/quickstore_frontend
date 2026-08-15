import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { RunningSeconds } from '@/components/ui/running-seconds';
import Link from 'next/link';
import Image from 'next/image';

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-16 sm:px-10">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center text-center">
          <Link href="/" className="mb-8 flex items-center justify-center gap-2">
            <Image src="https://cdn.quickstore88.com/quickstore/quickstore_log1.png" alt="QuickStore Icon" width={32} height={32} className="object-contain" />
            <Image src="https://cdn.quickstore88.com/quickstore/quickstore_log2.png" alt="QuickStore" width={140} height={32} className="object-contain" />
          </Link>
          <h2 className="font-sans text-[28px] font-medium text-black">
            Set new password
          </h2>
          <p className="mt-2 font-sans text-[14px] text-[#737373]">
            Please enter your new password below.
          </p>
        </div>

        <Suspense fallback={<div className="flex justify-center py-8"><span className="h-5 w-5 animate-spin rounded-full border-2 border-[#e5e5e5] border-t-black" /></div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
