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
    <main className="min-h-screen bg-background px-4 py-12 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-12 border-b border-border pb-10">
          <span className="mb-3 block font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            QuickStore Curated
          </span>
          <h1 className="font-display text-5xl italic tracking-tight text-foreground md:text-7xl lg:text-8xl">
            Collections
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Meticulously organised series of premium goods. Browse by category to find pieces that fit your lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((col, i) => (
            <motion.article
              key={col.slug}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: Math.min(i, 5) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group flex h-full w-full flex-col border border-border bg-background transition-colors duration-300 hover:border-foreground"
            >
              <div className="relative overflow-hidden border-b border-border bg-secondary">
                <div className="relative aspect-[1.48/1] overflow-hidden">
                  <Image
                    src={col.thumbnail}
                    alt={col.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover  transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
              </div>

              <div className="flex flex-1 flex-col px-5 py-5">
                <div className="flex-1">
                  <h4 className="mb-1.5 text-base font-medium leading-snug text-foreground transition-opacity group-hover:opacity-70 sm:text-lg">
                    {col.name}
                  </h4>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {col.productCount} {col.productCount === 1 ? 'product' : 'products'}
                  </p>
                </div>
                <div className="mt-4 border-t border-border pt-4">
                  <Link
                    href={`/shop?category=${col.slug}`}
                    className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground underline underline-offset-4 transition-opacity hover:opacity-60"
                  >
                    Explore <ArrowRight className="h-3.5 w-3.5" />
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
    <main className="min-h-screen bg-background px-4 py-12 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-12">
        <div className="space-y-4 border-b border-border pb-10">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-16 w-2/3 max-w-lg" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4 border border-border">
              <Skeleton className="aspect-[1.48/1] w-full" />
              <div className="space-y-2 px-5 pb-5">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
