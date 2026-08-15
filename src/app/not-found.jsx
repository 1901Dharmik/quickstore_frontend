import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Page Not Found — QuickStore',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="relative">
          {/* Subtle background text */}
          <span className="absolute -top-16 left-1/2 -translate-x-1/2 select-none font-display text-[160px] font-bold leading-none text-[#fafafa] sm:text-[220px] md:-top-24 md:text-[300px]">
            404
          </span>
          
          <div className="relative z-10 flex flex-col items-center">
            <h1 className="font-display text-[40px] font-medium tracking-tight text-black sm:text-[56px]">
              Page Not Found
            </h1>
            <p className="mx-auto mt-6 max-w-lg font-sans text-[16px] leading-relaxed text-[#737373]">
              The page you are looking for doesn't exist or has been moved. 
              Let's get you back on track to exploring our premium collection.
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/"
                className="group flex h-12 items-center justify-center gap-2 rounded-full bg-black px-8 font-sans text-[14px] font-medium text-white transition-all hover:bg-[#090909] hover:shadow-lg"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> 
                Go back home
              </Link>
              <Link
                href="/shop"
                className="flex h-12 items-center justify-center rounded-full border border-[#d4d4d4] bg-white px-8 font-sans text-[14px] font-medium text-black transition-colors hover:bg-[#fafafa]"
              >
                Browse catalogue
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
