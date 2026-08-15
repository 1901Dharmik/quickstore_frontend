"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAddToCart } from '@/hooks/use-cart';

function CarouselCard({ card }) {
  const addToCartMutation = useAddToCart();
  const router = useRouter();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCartMutation.mutate({ product_id: card.id, quantity: 1 });
  };

  return (
    <article className="group flex h-full w-full flex-col overflow-hidden rounded-[12px] border border-border bg-card transition-colors duration-300 hover:border-[#000]">
      <Link href={card.href || '#'} className="relative block overflow-hidden border-b border-border bg-secondary">
        <div className="relative aspect-[1.15/1] overflow-hidden">
          <Image
            src={card.image}
            alt={card.alt}
            fill
            sizes="(min-width: 1536px) 24vw, (min-width: 1280px) 32vw, (min-width: 1024px) 33vw, (min-width: 640px) 48vw, 90vw"
            className={`object-contain p-8  transition-transform duration-700 ease-out group-hover:scale-[1.04] ${card.imageClassName || ''}`}
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-5 py-5 sm:px-6 sm:py-6">
        <div className="min-h-14 flex-1">
          <Link href={card.href || '#'}>
            <h4 className="text-[20px] font-medium leading-snug text-foreground transition-opacity hover:opacity-70">
              {card.title}
            </h4>
          </Link>
          {card.description ? (
            <p className="mt-1.5 max-w-[28rem] text-[14px] leading-relaxed text-muted-foreground line-clamp-2">{card.description}</p>
          ) : null}
          {card.price ? (
            <h6 className="mt-3 font-mono text-[16px] font-medium text-foreground">{card.price}</h6>
          ) : null}
        </div>

        {card.hideLinks !== true && (
          <div className="mt-4 flex flex-row gap-2 border-t border-border pt-4">
            {(card.links?.length ? card.links : [{ label: 'Know more', href: card.href }]).map((linkItem) => {
              if (linkItem.action === 'add_to_cart') {
                return (
                  <button
                    key={`${card.title}-${linkItem.label}`}
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isPending}
                    className="flex h-9 flex-1 items-center justify-center rounded-full bg-black px-2 font-sans text-[13px] sm:text-[14px] font-medium text-white transition-colors hover:bg-[#090909] disabled:opacity-50"
                  >
                    {addToCartMutation.isPending ? 'Adding…' : linkItem.label}
                  </button>
                );
              }
              return (
                <button
                  key={`${card.title}-${linkItem.label}-${linkItem.href}`}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(linkItem.href);
                  }}
                  className="flex h-9 flex-1 items-center justify-center rounded-full border border-[#d4d4d4] bg-white px-2 font-sans text-[13px] sm:text-[14px] font-medium text-black transition-colors hover:bg-[#fafafa]"
                >
                  {linkItem.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}

export default function ExploreCarouselSection({
  title,
  description,
  cards,
  sectionClassName,
  viewAllHref,
  viewAllLabel = 'View all',
}) {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
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
  }, []);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.8;
    const nextLeft = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
    scrollRef.current.scrollTo({ left: nextLeft, behavior: 'smooth' });
  };

  return (
    <section className={`${sectionClassName || ''} tick-track overflow-x-hidden bg-background py-14 sm:py-16 lg:py-20`}>
      <div ref={containerRef} className="mx-auto mb-8 max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-[30px] font-medium tracking-tight text-foreground">{title}</h2>
            {description ? (
              <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">{description}</p>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="hidden font-sans text-[14px] font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground sm:inline-block"
              >
                {viewAllLabel}
              </Link>
            )}
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
          className="no-scrollbar flex gap-3 overflow-x-auto pb-4 scroll-smooth sm:gap-4"
          style={{
            paddingLeft: `${leftOffset}px`,
            paddingRight: `${leftOffset}px`,
          }}
        >
          {cards.map((card, i) => (
            <motion.div
              key={card.id || card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="basis-[82%] shrink-0 sm:basis-[46%] lg:basis-[31%] xl:basis-[23%]"
            >
              <CarouselCard card={card} />
            </motion.div>
          ))}
          <div className="h-full min-w-px shrink-0" />
        </div>
      </div>

      {viewAllHref && (
        <div className="mt-6 px-4 sm:hidden">
          <Link
            href={viewAllHref}
            className="inline-block font-mono text-[11px] uppercase tracking-[0.15em] text-foreground underline underline-offset-4"
          >
            {viewAllLabel}
          </Link>
        </div>
      )}
    </section>
  );
}
