"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function HeroSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden bg-black px-4 py-24 sm:py-32 lg:px-8">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=2500&auto=format&fit=crop"
          alt="Luxury Timepiece Background"
          fill
          priority
          className="object-cover opacity-[0.55]"
        />
        {/* Subtle gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/80" />
      </div>

      {/* Content */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex w-full max-w-[900px] flex-col items-center text-center"
      >
        <motion.div variants={item} className="mb-8 flex h-[32px] items-center justify-center rounded-full border border-white/20 bg-white/10 px-[16px] backdrop-blur-md">
          <code className="font-mono text-[11px] sm:text-[12px] tracking-[0.2em] text-white/90 uppercase">
            Ref. No. 001 — The Future of Horology
          </code>
        </motion.div>

        <motion.div variants={item}>
          <h1 className="font-display text-[44px] font-medium leading-[1.05] text-white sm:text-[64px] md:text-[80px] tracking-tight text-balance">
            Masterpieces of precision
          </h1>
        </motion.div>

        <motion.p variants={item} className="mt-8 max-w-lg text-center text-[16px] sm:text-[18px] text-white/70 leading-relaxed font-light text-balance">
          A curated selection of modern smart timepieces, where advanced technology meets contemporary design and timeless elegance.
        </motion.p>

        <motion.div variants={item} className="mt-12 flex flex-col gap-4 sm:flex-row sm:gap-5 w-full sm:w-auto px-4 sm:px-0">
          <Link
            href="/shop"
            className="group relative flex h-[52px] sm:w-[220px] items-center justify-center rounded-full bg-white px-[24px] font-sans text-[15px] font-medium text-black transition-all hover:scale-[1.02]"
          >
            Shop the collection
            <div className="absolute inset-0 rounded-full bg-white opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-30" />
          </Link>
          <Link
            href="/about"
            className="flex h-[52px] sm:w-[220px] items-center justify-center rounded-full border border-white/20 bg-white/5 px-[24px] font-sans text-[15px] font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/40"
          >
            Discover tech
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
