"use client";

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/api/category';
import { Skeleton } from '@/components/ui/skeleton';

export function CategorySection() {
  const scrollRef = useRef(null);
  
  const { data: fetched = [], isPending, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
  });

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    const currentScroll = scrollRef.current.scrollLeft;
    scrollRef.current.scrollTo({
      left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: 'smooth'
    });
  };

  if (isError) return null;

  if (isPending) {
    return (
      <section className="bg-[#f5f5f5] py-16">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="w-[180px] h-[220px] rounded-lg shrink-0" />
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
      image: imageUrl,
      href: `/shop?category=${item.slug || ""}`,
    };
  });

  return (
    <section className="bg-[#f5f5f5] py-14 sm:py-16 lg:py-20 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-end justify-between mb-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-[26px] font-medium tracking-tight text-foreground sm:text-[32px]">
              Curated Collections
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Discover our meticulously crafted timepieces.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button 
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scroll-smooth no-scrollbar"
        >
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={category.href}
              className="group relative flex-shrink-0 w-[200px] sm:w-[240px] snap-start rounded-lg overflow-hidden bg-white hover:shadow-lg transition-all duration-300 block"
            >
              <div className="relative h-[200px] sm:h-[240px] w-full bg-[#f8f9fa]">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(min-width: 640px) 240px, 200px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-medium text-[#333] text-[16px]">{category.title}</h3>
              </div>
            </Link>
          ))}
          
          {/* Explore All Card */}
          <Link 
            href="/collections"
            className="group relative flex-shrink-0 w-[200px] sm:w-[240px] snap-start rounded-xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center"
          >
            <div className="w-14 h-14 rounded-full bg-[#f5f5f5] flex items-center justify-center mb-4 group-hover:bg-[#222] group-hover:text-white transition-colors duration-300 text-black">
              <ArrowRight className="w-6 h-6" />
            </div>
            <h3 className="font-medium text-[#333] text-[16px]">Explore All</h3>
            <p className="text-[12px] text-gray-500 mt-1">See everything</p>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
