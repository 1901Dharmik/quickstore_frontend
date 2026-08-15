"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchBrands } from '@/api/brand';
import { Skeleton } from '@/components/ui/skeleton';

export function BrandSection() {
  const { data: brands = [], isPending, isError } = useQuery({
    queryKey: ['brands'],
    queryFn: () => fetchBrands(),
  });

  if (isError) return null;

  if (isPending) {
    return (
      <section className="tick-track bg-background py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <Skeleton className="mx-auto mb-2 h-3 w-32" />
            <Skeleton className="mx-auto h-8 w-48" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex h-32 items-center justify-center border border-border">
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (brands.length === 0) return null;

  return (
    <section className="tick-track bg-background py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center"
        >
          <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Elite watchmakers
          </span>
          <h2 className="font-display text-3xl italic tracking-tight text-foreground sm:text-4xl">
            Shop by brand
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-5">
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
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={`/shop?brand=${slug}`}
                  className="group relative flex h-32 flex-col items-center justify-center overflow-hidden border border-border bg-secondary/40 p-4 text-center transition-colors duration-300 hover:border-foreground sm:h-40"
                >
                  {imageUrl && (
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={brand.name}
                        className="h-full w-full object-cover grayscale opacity-40 transition-all duration-700 group-hover:scale-110 group-hover:opacity-55"
                      />
                      <div className="absolute inset-0 bg-background/40" />
                    </div>
                  )}

                  <div className="relative z-10 flex w-full flex-col items-center">
                    <span className="font-display text-lg italic tracking-tight text-foreground sm:text-xl">
                      {brand.name}
                    </span>

                    {brand.description && (
                      <span className="mt-2 hidden max-w-[85%] font-mono text-[9px] uppercase tracking-widest text-muted-foreground line-clamp-2 opacity-0 transition-all duration-300 group-hover:opacity-100 sm:block">
                        {brand.description}
                      </span>
                    )}

                    {displayUrl && (
                      <span className="mt-2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground opacity-0 transition-opacity delay-100 duration-300 group-hover:opacity-100">
                        {displayUrl}
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
