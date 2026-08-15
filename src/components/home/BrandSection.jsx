"use client";

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchBrands } from '@/api/brand';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function BrandSection() {
  const { data: brands = [], isPending, isError } = useQuery({
    queryKey: ['brands'],
    queryFn: () => fetchBrands(),
  });

  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const [leftOffset, setLeftOffset] = useState(0);

  useEffect(() => {
    const updateOffset = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const style = window.getComputedStyle(containerRef.current);
      const paddingLeft = parseFloat(style.paddingLeft);
      setLeftOffset(rect.left + paddingLeft);
    };

    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.removeEventListener('resize', updateOffset);
  }, [isPending]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.8;
    const nextLeft = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
    scrollRef.current.scrollTo({ left: nextLeft, behavior: 'smooth' });
  };

  if (isError) return null;

  if (isPending) {
    return (
      <section className="tick-track overflow-x-hidden bg-background py-16 sm:py-24 lg:py-32">
        <div className="mx-auto mb-8 max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <Skeleton className="mb-3 h-3 w-32" />
              <Skeleton className="h-10 w-64" />
            </div>
            <div className="hidden gap-2 sm:flex">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>
        <div className="flex gap-4 overflow-hidden px-4 sm:px-6 lg:px-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col w-[280px] shrink-0 rounded-[16px] border border-border">
              <Skeleton className="aspect-[4/5] w-full rounded-[16px]" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (brands.length === 0) return null;

  return (
    <section className="tick-track overflow-x-hidden bg-background py-16 sm:py-20">
      <div ref={containerRef} className="mx-auto mb-8 max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-display text-[32px] font-medium tracking-tight text-foreground sm:text-[40px]">
              The Heritage Collection
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground max-w-2xl">
              Explore masterpieces from the world's most distinguished watchmakers.
            </p>
          </motion.div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:bg-muted"
                aria-label="Scroll left"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:bg-muted"
                aria-label="Scroll right"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="no-scrollbar flex gap-4 overflow-x-auto pb-6 scroll-smooth sm:gap-6"
          style={{
            paddingLeft: `${leftOffset}px`,
            paddingRight: `${leftOffset}px`,
          }}
        >
          {brands.map((brand, i) => {
            const slug = brand.slug || brand.name.toLowerCase();
            const imageUrl = brand.image?.url;
            let displayUrl = '';
            try {
              if (brand.website) displayUrl = new URL(brand.website).hostname.replace('www.', '');
            } catch (e) {
              /* ignore malformed URL */
            }

            return (
              <motion.div
                key={brand._id || brand.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex w-[180px] sm:w-[220px] aspect-[4/5] sm:aspect-square flex-col justify-end shrink-0 overflow-hidden rounded-[16px] border border-border bg-card transition-colors duration-500 hover:border-[#000] dark:hover:border-white/50"
              >
                <Link href={`/shop?brand=${slug}`} className="absolute inset-0 z-20">
                  <span className="sr-only">Shop {brand.name}</span>
                </Link>

                {imageUrl ? (
                  <div className="absolute inset-0 z-0 overflow-hidden bg-secondary">
                    <img
                      src={imageUrl}
                      alt={brand.name}
                      className="h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                ) : (
                  <div className="absolute inset-0 z-0 bg-secondary" />
                )}

                <div className="relative z-10 flex w-full flex-col items-center p-4 sm:p-5 translate-y-3 sm:translate-y-5 transition-transform duration-500 ease-out group-hover:translate-y-0">
                  <span className={`font-display text-[18px] sm:text-[20px] font-medium tracking-tight ${imageUrl ? 'text-white' : 'text-foreground'}`}>
                    {brand.name}
                  </span>

                  <div className="mt-3 flex flex-col items-center opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100">
                    <div className={`h-px w-6 mb-3 ${imageUrl ? 'bg-white/30' : 'bg-foreground/20'}`} />
                    {displayUrl ? (
                      <span className={`font-mono text-[10px] uppercase tracking-widest ${imageUrl ? 'text-white/70' : 'text-muted-foreground'}`}>
                        {displayUrl}
                      </span>
                    ) : (
                      <span className={`font-mono text-[10px] uppercase tracking-widest ${imageUrl ? 'text-white/70' : 'text-muted-foreground'}`}>
                        Explore
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
          {/* Spacer to allow full scroll to the right edge */}
          <div className="h-full min-w-px shrink-0" />
        </div>
      </div>
    </section>
  );
}
