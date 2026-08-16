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
    <section className="tick-track py-14 sm:py-16 lg:py-20" style={{ backgroundColor: "#f5f5f5"}}>
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

        <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, i) => {
            const discountPercent = product.originalPrice > product.price 
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
              : null;

            return (
              <article key={`${product.id}-${i}`} className="group relative bg-white transition-all hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 cursor-pointer flex flex-col p-3 sm:p-6 min-h-[300px] sm:min-h-[400px] h-full rounded-[0px] overflow-hidden rounded-lg">
                
                {/* Top Left Badge */}
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20">
                  {discountPercent ? (
                    <span className="border border-[#ff6900] text-[#ff6900] text-[10px] sm:text-[12px] px-1 py-0.5 rounded-sm bg-white">
                      {discountPercent}% off
                    </span>
                  ) : null}
                </div>

                <div className="relative w-full h-[150px] sm:h-[180px] md:h-[220px] mb-4 sm:mb-6">
                  <Link href={product.href} className="absolute inset-0 z-10" />
                  <Image 
                    src={product.image} 
                    alt={product.alt} 
                    fill 
                    className="object-contain object-center transition-transform duration-500 group-hover:scale-105" 
                  />
                </div>

                <div className="flex flex-col items-center text-center z-10 flex-grow">
                  <h3 className="text-[16px] sm:text-[18px] md:text-[20px] font-medium text-[#333] mb-1 sm:mb-2 truncate w-full px-1 sm:px-2">{product.title}</h3>
                  
                  <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-4">
                    <span className="text-[14px] sm:text-[16px] text-[#333]">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-[12px] sm:text-[14px] text-[#b0b0b0] line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 w-full justify-center mt-auto relative z-20">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCartMutation.mutate({ product_id: product.id, quantity: 1 });
                      }}
                      disabled={addToCartMutation.isPending}
                      className="bg-[#222] text-white text-[12px] sm:text-[13px] px-3 sm:px-4 py-1.5 rounded-md hover:bg-black transition-colors w-full sm:w-max"
                    >
                      {addToCartMutation.isPending ? 'Adding...' : 'Add to cart'}
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(product.href);
                      }}
                      className="hidden sm:inline-block bg-white text-black border border-gray-400 text-[12px] sm:text-[13px] px-3 sm:px-4 py-1.5 rounded-md hover:border-black transition-colors w-max"
                    >
                      Know more
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
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
