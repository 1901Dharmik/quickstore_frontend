"use client";

import { useQuery } from '@tanstack/react-query';
import ExploreCarouselSection from '@/components/home/ExploreCarouselSection';
import { fetchProducts } from '@/api/product';
import { Skeleton } from '@/components/ui/skeleton';

export function CollectionSection() {
  const { data: res, isPending, isError } = useQuery({
    queryKey: ['products', 'collections'],
    queryFn: () => fetchProducts({ limit: 4 }),
  });

  if (isError) return null;

  const products = res?.data || [];

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

  const cards = products.map((item) => {
    let imageUrl = "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?q=80&w=800";
    if (item.images && item.images.length > 0 && item.images[0]?.url) {
      imageUrl = item.images[0].url;
    }

    const price = item.price || 0;

    return {
      id: item._id,
      title: item.title || "Product",
      description: item.description,
      price: `₹${price.toLocaleString('en-IN')}`,
      rawPrice: price,
      originalPrice: item.compare_at_price || item.attributes?.compare_at_price || price,
      image: imageUrl,
      alt: item.title || "Product",
      href: `/product/${item.slug || item._id}`,
      links: [
        { label: 'Add to Cart', action: 'add_to_cart' },
        { label: 'Know more', href: `/product/${item.slug || item._id}` },
      ],
    };
  });

  // Fallback if fetch fails or no products
  if (cards.length === 0) {
    cards.push({
      id: 'fallback-1',
      title: 'QuickStore Signature Collection',
      description: 'Premium items selected for customers who want statement design without guesswork.',
      price: '₹0.00',
      image: 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?q=80&w=800&auto=format&fit=crop',
      alt: 'Fallback product',
      href: '/shop',
      links: [
        { label: 'Shop Now', href: '/shop' }
      ],
    });
  }

  return (
    <ExploreCarouselSection
      title="QuickStore Product Edit"
      description="Discover curated collections from QuickStore, built to help shoppers find premium styles, everyday bestsellers, and standout gift options faster."
      cards={cards}
      viewAllHref="/shop"
    />
  );
}
