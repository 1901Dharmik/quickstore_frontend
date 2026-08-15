"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchCategories } from '@/api/category';
import { fetchProducts } from '@/api/product';

export default function CollectionsPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const catsRes = await fetchCategories();
        const collections = await Promise.all(
          catsRes.map(async (cat) => {
            const prodRes = await fetchProducts({ category: cat._id, limit: 1 });
            return {
              id: cat._id,
              name: cat.title || cat.name,
              slug: cat.slug,
              description: cat.description,
              thumbnail: cat.image?.url || 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?q=80&w=800',
              productCount: prodRes?.pagination?.total || 0,
            };
          })
        );
        setCategories(collections);
      } catch (err) {
        console.error('Failed to fetch collections', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <CollectionsSkeleton />;

  return (
    <main className="min-h-screen bg-white px-4 py-20 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="mb-16 border-b border-[#e5e5e5] pb-10">
          <h1 className="font-display text-[36px] font-medium text-black">
            Collections
          </h1>
          <p className="mt-4 max-w-xl font-sans text-[16px] text-[#737373]">
            Meticulously organised series of premium goods. Browse by category to find pieces that fit your lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((col, i) => (
            <motion.article
              key={col.slug}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: Math.min(i, 5) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group flex h-full w-full flex-col rounded-[12px] border border-[#e5e5e5] bg-white transition-shadow duration-300 hover:shadow-sm"
            >
              <div className="relative overflow-hidden rounded-t-[12px] border-b border-[#e5e5e5] bg-white">
                <div className="relative aspect-[1.48/1] overflow-hidden">
                  <Image
                    src={col.thumbnail}
                    alt={col.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  />
                </div>
              </div>

              <div className="flex flex-1 flex-col px-5 py-5">
                <div className="flex-1">
                  <h4 className="mb-1 font-sans text-[16px] font-medium leading-snug text-black transition-opacity hover:opacity-70">
                    {col.name}
                  </h4>
                  <p className="font-sans text-[14px] text-[#737373]">
                    {col.productCount} {col.productCount === 1 ? 'product' : 'products'}
                  </p>
                </div>
                <div className="mt-6">
                  <Link
                    href={`/shop?category=${col.slug}`}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-[#d4d4d4] bg-white px-5 font-sans text-[14px] font-medium text-black transition-colors hover:bg-[#fafafa]"
                  >
                    Explore <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </main>
  );
}

function CollectionsSkeleton() {
  return (
    <main className="min-h-screen bg-white px-4 py-20 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px] space-y-16">
        <div className="space-y-4 border-b border-[#e5e5e5] pb-10">
          <Skeleton className="h-10 w-2/3 max-w-sm rounded-full" />
          <Skeleton className="h-5 w-3/4 max-w-xl rounded-full" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4 rounded-[12px] border border-[#e5e5e5] p-4">
              <Skeleton className="aspect-[1.48/1] w-full rounded-[8px]" />
              <div className="space-y-3 px-1 pb-1">
                <Skeleton className="h-5 w-3/4 rounded-full" />
                <Skeleton className="h-4 w-1/3 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
