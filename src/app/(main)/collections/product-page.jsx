"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { fetchProductBySlugOrId, fetchProducts } from '@/api/product';
import { PackageSearch, ShoppingCart, CreditCard, Tag, Boxes, AlertCircle } from 'lucide-react';
import { useAddToCart } from '@/hooks/use-cart';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}

function ProductPageSkeleton() {
  return (
    <main className="min-h-screen bg-background px-4 py-12 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-5">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-7 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 flex-1" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ProductPage({ productId, initialData }) {
  const router = useRouter();
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const addToCartMutation = useAddToCart();

  const { data: productData, isPending, isError } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductBySlugOrId(productId),
    initialData,
    enabled: !!productId,
  });

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const attrs = productData || {};
  const categoryObj = attrs.categories?.[0] || attrs.category;
  const categoryDocId = categoryObj?._id || categoryObj?.id;

  const { data: relatedRes } = useQuery({
    queryKey: ['products', 'related', categoryDocId, attrs._id],
    queryFn: () => fetchProducts({ category: categoryDocId, limit: 4 }),
    enabled: !!categoryDocId && !!attrs._id,
  });

  const allImages = attrs.images?.map(img => img.url).filter(Boolean) || [];
  if (allImages.length === 0) allImages.push('https://images.unsplash.com/photo-1548171915-e79a380a2a4b?q=80&w=800');

  const variants = (Array.isArray(attrs.variants) ? attrs.variants : []).map((item, idx) => ({
    id: item._id,
    title: item.title || '',
    sku: item.sku || '',
    price: item.price || 0,
    comparePrice: item.compare_at_price || 0,
    stock: item.stock || 0,
    images: item.image?.url ? [item.image.url] : [],
    attributes: (item.attributes || []).map(a => ({ name: a.name || '', value: a.value || '' })).filter(a => a.name),
    isDefault: idx === 0,
  }));

  const optionGroups = {};
  variants.forEach(v => v.attributes.forEach(attr => {
    if (!optionGroups[attr.name]) optionGroups[attr.name] = [];
    if (!optionGroups[attr.name].some(i => i.value === attr.value)) optionGroups[attr.name].push({ value: attr.value });
  }));

  useEffect(() => {
    if (variants.length > 0) {
      const def = variants[0];
      const init = {};
      def.attributes.forEach(a => { init[a.name] = a.value; });
      setSelectedOptions(init);
    }
  }, [productData]);

  const activeVariant = variants.find(v => v.attributes.every(a => selectedOptions[a.name] === a.value));

  if (isPending) return <ProductPageSkeleton />;

  if (isError || !productData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="flex max-w-sm flex-col items-center gap-4 border border-border p-10 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground" />
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Product not found</p>
          <Link href="/shop" className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground underline underline-offset-4">
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const price = activeVariant ? activeVariant.price : (attrs.price || 0);
  const originalPrice = activeVariant ? (activeVariant.comparePrice || price) : (attrs.compare_at_price || price);
  const hasDiscount = originalPrice > price;
  const discountPct = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const currentImages = (activeVariant?.images?.length > 0) ? activeVariant.images : allImages;
  const stock = activeVariant ? activeVariant.stock : (attrs.stock || 0);
  const sku = activeVariant ? activeVariant.sku : (attrs.sku || '');
  const brandName = attrs.brand?.name || 'QuickStore';
  const categoryName = categoryObj?.title || categoryObj?.name || 'Uncategorized';

  const handleAddToCart = () => addToCartMutation.mutate({ product_id: attrs._id || attrs.id, variant_id: activeVariant?.id || null, quantity: 1 });
  const handleBuyNow = () => addToCartMutation.mutate({ product_id: attrs._id || attrs.id, variant_id: activeVariant?.id || null, quantity: 1 }, { onSuccess: () => router.push('/checkout') });

  return (
    <main className="min-h-screen bg-background px-4 py-12 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <div className="space-y-3">
            <Carousel setApi={setApi} className="group w-full">
              <CarouselContent>
                {currentImages.map((img, idx) => (
                  <CarouselItem key={`${img}-${idx}`}>
                    <div className="relative aspect-square overflow-hidden border border-border bg-secondary">
                      <Image
                        src={img}
                        alt={`${attrs.title || 'Product'} — image ${idx + 1}`}
                        fill
                        priority={idx === 0}
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-contain p-8 "
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {currentImages.length > 1 && (
                <>
                  <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100" />
                  <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100" />
                </>
              )}
            </Carousel>
            {currentImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {currentImages.map((img, idx) => (
                  <button
                    key={`${img}-thumb-${idx}`}
                    onClick={() => api?.scrollTo(idx)}
                    className={cn(
                      'relative aspect-square overflow-hidden border bg-secondary transition-all',
                      current === idx ? 'border-foreground' : 'border-border opacity-50 hover:opacity-100'
                    )}
                    aria-label={`Go to image ${idx + 1}`}
                  >
                    <Image src={img} alt="" fill sizes="10vw" className="object-contain p-1 " />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {attrs.is_bestseller && (
                <span className="bg-foreground px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-background">Bestseller</span>
              )}
              {attrs.is_new_arrival && (
                <span className="border border-foreground px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-foreground">New Arrival</span>
              )}
              {attrs.is_featured && (
                <span className="border border-border px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Featured</span>
              )}
            </div>

            <div>
              <h1 className="font-display text-3xl italic tracking-tight text-foreground md:text-4xl lg:text-5xl">
                {attrs.title}
              </h1>
              {attrs.shortDescription && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{attrs.shortDescription}</p>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-mono text-2xl font-medium text-foreground">{formatCurrency(price)}</span>
              {hasDiscount && (
                <>
                  <span className="font-mono text-sm text-muted-foreground line-through">{formatCurrency(originalPrice)}</span>
                  <span className="font-mono text-sm text-foreground">−{discountPct}%</span>
                </>
              )}
            </div>

            {/* Variant selectors */}
            {Object.keys(optionGroups).length > 0 && (
              <div className="space-y-5 border-t border-border pt-5">
                {Object.entries(optionGroups).map(([name, values]) => (
                  <div key={name}>
                    <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {name}: <span className="text-foreground">{selectedOptions[name]}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {values.map(({ value }) => (
                        <button
                          key={value}
                          onClick={() => setSelectedOptions(prev => ({ ...prev, [name]: value }))}
                          className={cn(
                            'border px-4 py-2 font-mono text-xs transition-colors',
                            selectedOptions[name] === value
                              ? 'border-foreground bg-foreground text-background'
                              : 'border-border text-foreground hover:border-foreground'
                          )}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Meta */}
            <div className="space-y-2 border-t border-border pt-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Tag className="h-3.5 w-3.5" /> Brand: <span className="text-foreground">{brandName}</span></div>
              <div className="flex items-center gap-2"><Boxes className="h-3.5 w-3.5" /> Category: <span className="text-foreground">{categoryName}</span></div>
              <div className="flex items-center gap-2">
                <PackageSearch className="h-3.5 w-3.5" />
                <span className={stock === 0 ? 'text-muted-foreground' : stock <= 10 ? 'text-foreground' : 'text-foreground'}>
                  {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                </span>
              </div>
              {sku && <p className="font-mono text-[10px] uppercase tracking-widest">SKU: {sku}</p>}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                onClick={handleAddToCart}
                disabled={stock === 0 || addToCartMutation.isPending}
                className="flex flex-1 items-center justify-center gap-2 bg-foreground px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ShoppingCart className="h-4 w-4" />
                {addToCartMutation.isPending ? 'Adding…' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={stock === 0 || addToCartMutation.isPending}
                className="flex flex-1 items-center justify-center gap-2 border border-foreground px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
              >
                <CreditCard className="h-4 w-4" />
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Description & Specs */}
        {(attrs.description || attrs.specifications?.length > 0) && (
          <div className="tick-track space-y-10 pt-10">
            {attrs.description && (
              <div>
                <span className="mb-3 block font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Product Details</span>
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{attrs.description}</p>
              </div>
            )}
            {attrs.specifications?.length > 0 && (
              <div>
                <span className="mb-4 block font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Specifications</span>
                <div className="grid grid-cols-1 gap-x-12 gap-y-3 sm:grid-cols-2">
                  {attrs.specifications.map((spec, i) => (
                    <div key={i} className="flex justify-between border-b border-border pb-2 text-sm">
                      <span className="text-muted-foreground">{spec.key}</span>
                      <span className="font-medium text-foreground">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Related */}
        {relatedRes?.data?.length > 0 && (
          <div className="tick-track pt-10">
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Discover More</span>
            <h3 className="mb-8 font-display text-2xl italic tracking-tight text-foreground">Related Masterpieces</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {relatedRes.data.map(item => {
                const rImg = item.images?.[0]?.url || 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?q=80&w=800';
                return (
                  <article key={item._id} className="group border border-border bg-background transition-colors hover:border-foreground">
                    <Link href={`/product/${item.slug || item._id}`} className="relative block overflow-hidden border-b border-border bg-secondary">
                      <div className="relative aspect-square overflow-hidden">
                        <Image src={rImg} alt={item.title} fill sizes="25vw" className="object-contain p-5  transition-transform duration-700 group-hover:scale-[1.04]" />
                      </div>
                    </Link>
                    <div className="px-4 py-4">
                      <Link href={`/product/${item.slug || item._id}`}>
                        <h4 className="text-sm font-medium text-foreground line-clamp-1 transition-opacity group-hover:opacity-70">{item.title}</h4>
                      </Link>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">{formatCurrency(item.price || 0)}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
