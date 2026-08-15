"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { RunningSeconds } from '@/components/ui/running-seconds';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export function HeroSection() {
  return (
    <section className="relative flex min-h-[92vh] w-full items-end overflow-hidden bg-foreground sm:min-h-screen">
      <img
        src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1920&auto=format&fit=crop"
        alt="A modern smartwatch, dial face detail"
        className="absolute inset-0 h-full w-full object-cover object-center contrast-[1.05]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-primary/20 backdrop-blur-[2px]" />

      {/* Live seconds mark, top-right — the page opens already ticking */}
      <div className="absolute right-4 top-6 z-10 sm:right-6 sm:top-8 lg:right-8">
        <RunningSeconds size={26} label="Live" className="text-white/70" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex w-full flex-col px-4 pb-14 pt-24 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24"
      >
        <div className="mx-auto w-full max-w-[1600px]">
          <motion.span
            variants={item}
            className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-primary backdrop-blur-md sm:text-xs"
          >
            Ref. No. 001 — The Future of Horology
          </motion.span>

          <motion.h1
            variants={item}
            className="max-w-3xl font-display text-[13vw] font-bold leading-[0.95] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:max-w-4xl lg:text-8xl"
          >
            Masterpieces of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">precision</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-md text-base font-light leading-relaxed text-muted-foreground sm:max-w-lg sm:text-lg"
          >
            A curated selection of modern smart timepieces, where advanced
            technology meets contemporary design.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/shop"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(var(--primary),0.6)]"
            >
              Shop the collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-border bg-background/50 px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-foreground backdrop-blur-md transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
            >
              Discover tech
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
