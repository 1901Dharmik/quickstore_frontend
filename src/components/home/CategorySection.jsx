"use client";

import { useQuery } from '@tanstack/react-query';
import ExploreCarouselSection from '@/components/home/ExploreCarouselSection';
import { fetchCategories } from '@/api/category';
import { Skeleton } from '@/components/ui/skeleton';

export function CategorySection() {
  const { data: fetched = [], isPending, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
  });

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

  if (fetched.length === 0) return null;

  const categories = fetched.map((item) => {
    let imageUrl = "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop";
    
    if (item.image?.url) {
      imageUrl = item.image.url;
    }

    return {
      id: item._id || item.id,
      title: item.name || item.title || "Category",
      description: item.description,
      image: imageUrl,
      href: `/shop?category=${item.slug || ""}`,
      alt: item.name || item.title || "Category",
      hideLinks: true,
    };
  });

  return (
    <ExploreCarouselSection
      title="Curated Collections"
      description="Discover our meticulously crafted timepieces, designed for those who appreciate the finer things in life."
      cards={categories}
      viewAllHref="/collections"
    />
  );
}
