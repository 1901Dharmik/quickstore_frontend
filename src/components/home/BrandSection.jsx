"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchBrands } from '@/api/brand';
import { Skeleton } from '@/components/ui/skeleton';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function BrandSection() {
  const { data: brands = [], isPending, isError } = useQuery({
    queryKey: ['brands'],
    queryFn: () => fetchBrands(),
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps'
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const containerRef = useRef(null);
  const [leftOffset, setLeftOffset] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

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

  if (isError) return null;

  if (isPending) {
    return (
      <section className="overflow-x-hidden bg-[#fafafa] py-12">
        <div ref={containerRef} className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 sm:gap-8 overflow-hidden">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="flex shrink-0 flex-col items-center gap-3 w-[80px] sm:w-[120px]">
                <Skeleton className="h-[80px] sm:h-[120px] w-full bg-[#eaeaea]" />
                <Skeleton className="h-4 w-16 bg-[#eaeaea]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (brands.length === 0) return null;

  return (
    <section className="overflow-x-hidden bg-[#fafafa] py-10 group/section">
      {/* Hidden container just to measure the correct margin-left for the scroll track */}
      <div ref={containerRef} className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8" />
      
      <div className="relative mx-auto max-w-[1440px]">
        {/* Embla Viewport */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div 
            className="flex touch-pan-y"
            style={{
              paddingLeft: `${leftOffset}px`,
              paddingRight: `${leftOffset}px`,
            }}
          >
            {brands.map((brand, i) => {
              const slug = brand.slug || brand.name.toLowerCase();
              const imageUrl = brand.image?.url || brand.image;

              return (
                <motion.div
                  key={brand._id || brand.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.4, delay: Math.min(i, 10) * 0.05, ease: 'easeOut' }}
                  className="group flex flex-col items-center shrink-0 w-[100px] sm:w-[140px] mr-4 sm:mr-8 cursor-pointer"
                >
                  <Link href={`/shop?brand=${slug}`} className="flex flex-col items-center w-full">
                    <div className="flex h-[90px] sm:h-[130px] w-full items-center justify-center overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={brand.name}
                          className="h-full w-full object-contain p-2 mix-blend-multiply"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#f0f0f0] rounded-xl text-[#a3a3a3] text-xs uppercase tracking-wider">
                          {brand.name[0]}
                        </div>
                      )}
                    </div>
                    
                    <span className="mt-3 text-center font-sans text-[13px] sm:text-[15px] font-medium text-[#333333] transition-colors group-hover:text-black line-clamp-2 leading-snug">
                      {brand.name}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Navigation Arrows (visible on hover) */}
        {canScrollPrev && (
          <button
            onClick={() => emblaApi && emblaApi.scrollPrev()}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-[#e5e5e5] text-black opacity-0 transition-opacity duration-300 hover:bg-[#fafafa] group-hover/section:opacity-100 z-10 hidden sm:flex"
            aria-label="Previous brands"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {canScrollNext && (
          <button
            onClick={() => emblaApi && emblaApi.scrollNext()}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-[#e5e5e5] text-black opacity-0 transition-opacity duration-300 hover:bg-[#fafafa] group-hover/section:opacity-100 z-10 hidden sm:flex"
            aria-label="Next brands"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </section>
  );
}
