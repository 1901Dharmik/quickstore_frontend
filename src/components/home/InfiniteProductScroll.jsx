"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { fetchProducts } from '@/api/product';
import { useAddToCart } from '@/hooks/use-cart';

export function InfiniteProductScroll() {
  const { ref, inView } = useInView({ rootMargin: '400px 0px' });
  const addToCartMutation = useAddToCart();
  const router = useRouter();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: ({ pageParam = 1 }) => fetchProducts({
      page: pageParam,
      limit: 12,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination) return undefined;
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const products = data?.pages.flatMap((page) => {
    const pageData = page?.data || [];
    return pageData.map((item) => {
      let imageUrl = 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?q=80&w=800&auto=format&fit=crop';
      if (item.images && item.images.length > 0 && item.images[0].url) {
        imageUrl = item.images[0].url;
      }

      return {
        id: item._id,
        title: item.title || 'Product',
        price: item.price || 0,
        rawPrice: item.price || 0,
        originalPrice: item.compare_at_price || item.attributes?.compare_at_price || item.price || 0,
        image: imageUrl,
        alt: item.title || 'Product',
        href: `/product/${item.slug || item._id}`,
        bestSeller: item.is_bestseller || false,
        newArrival: item.is_featured || false,
      };
    });
  }) || [];

  return (
    <section className="tick-track bg-background py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="font-display text-[30px] font-medium tracking-tight text-foreground sm:text-[36px]">
            The product collection
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
            Every timepiece we carry, in one place.
          </p>
        </div>

        {isError && (
          <div className="mx-auto mb-10 max-w-md border border-border p-6 text-center">
            <p className="text-sm text-foreground">Failed to load products. Please try again later.</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, i) => (
            <article
              key={`${product.id}-${i}`}
              className="group flex h-full w-full flex-col overflow-hidden rounded-[12px] border border-border bg-card transition-colors duration-300 hover:border-[#000]"
            >
              <div className="relative block overflow-hidden border-b border-border bg-secondary">
                <div className="pointer-events-none absolute left-2 top-2 z-10 flex flex-col gap-1.5 sm:left-3 sm:top-3">
                  {product.bestSeller && (
                    <span className="rounded-full bg-primary px-3 py-1 font-sans text-[12px] font-medium text-primary-foreground shadow-sm">
                      Bestseller
                    </span>
                  )}
                  {product.newArrival && (
                    <span className="rounded-full border border-border bg-background px-3 py-1 font-sans text-[12px] font-medium text-foreground shadow-sm">
                      New
                    </span>
                  )}
                </div>

                <Link href={product.href} className="relative block">
                  <div className="relative aspect-square overflow-hidden sm:aspect-[1.15/1]">
                    <Image
                      src={product.image}
                      alt={product.alt}
                      fill
                      sizes="(min-width: 1280px) 24vw, (min-width: 1024px) 32vw, 48vw"
                      className="object-contain p-5  transition-transform duration-700 ease-out group-hover:scale-[1.04] sm:p-7"
                    />
                  </div>
                </Link>
              </div>

              <div className="flex flex-1 flex-col px-3.5 py-3.5 sm:px-5 sm:py-5">
                <div className="min-h-10 flex-1">
                  <Link href={product.href}>
                    <h4 className="mb-2 text-[18px] font-medium leading-snug text-foreground transition-opacity hover:opacity-70">
                      {product.title}
                    </h4>
                  </Link>
                  <div className="flex items-center gap-2">
                    <h6 className="font-mono text-[16px] font-medium text-foreground">₹{product.price.toLocaleString('en-IN')}</h6>
                    {product.originalPrice > product.rawPrice && (
                      <>
                        <p className="font-mono text-[14px] text-muted-foreground line-through">₹{product.originalPrice.toLocaleString('en-IN')}</p>
                        <span className="rounded-sm bg-red-50 px-1.5 py-0.5 font-sans text-[11px] font-bold text-red-600">
                          −{Math.round(((product.originalPrice - product.rawPrice) / product.originalPrice) * 100)}%
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex flex-row gap-2 border-t border-border pt-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToCartMutation.mutate({ product_id: product.id, quantity: 1 });
                    }}
                    disabled={addToCartMutation.isPending}
                    className="flex h-9 flex-1 items-center justify-center rounded-full bg-black px-2 font-sans text-[13px] sm:text-[14px] font-medium text-white transition-colors hover:bg-[#090909] disabled:opacity-50"
                  >
                    {addToCartMutation.isPending ? 'Adding…' : 'Add to cart'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(product.href);
                    }}
                    className="hidden md:block flex h-9 flex-1 items-center justify-center rounded-full border border-[#d4d4d4] bg-white px-2 font-sans text-[13px] sm:text-[14px] font-medium text-black transition-colors hover:bg-[#fafafa]"
                  >
                    Know more
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {(isPending || isFetchingNextPage) && (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-foreground" />
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {isPending ? 'Loading products' : 'Loading more'}
            </p>
          </div>
        )}

        {/* Sentinel — triggers the next page as it scrolls into view */}
        <div ref={ref} className="h-px w-full" />

        {!isPending && !hasNextPage && products.length > 0 && (
          <div className="tick-track mt-10 pt-6 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              You've reached the end of the collection
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
