"use client";

import { useQuery } from '@tanstack/react-query';
import ExploreCarouselSection from '@/components/home/ExploreCarouselSection';
import { fetchProducts } from '@/api/product';
import { Skeleton } from '@/components/ui/skeleton';

export function FeaturedSection() {
  const { data: res, isPending, isError } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => fetchProducts({ is_featured: true, limit: 8 }),
  });

  const products = res?.data || [];

  if (isError) return null;

  if (isPending) {
    return (
      <section className="bg-background py-16 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
            <div className="max-w-3xl">
              <Skeleton className="h-8 w-64 mb-3" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col bg-transparent">
                <Skeleton className="aspect-[1.48/1] w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  const resolveUrl = (images) => {
    if (!images || images.length === 0) return "";
    return images[0]?.url || "";
  };

  const cards = products.map((item) => {
    const price = item.price || 0;
    return {
      id: item._id,
      title: item.title || "Watch",
      price: `₹${price}`,
      image: resolveUrl(item.images) || "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?q=80&w=800",
      alt: item.title || "Watch",
      href: `/product/${item.slug || item._id}`,
      links: [
        { label: 'Add to Cart', action: 'add_to_cart' },
        { label: 'Know more', href: `/product/${item.slug || item._id}` },
      ],
    };
  });

  return (
    <ExploreCarouselSection
      title="Spotlight Collection"
      description="Exclusive items curated by our watch specialists for their historical importance and exceptional complications."
      cards={cards}
      viewAllHref="/shop"
    />
  );
}
