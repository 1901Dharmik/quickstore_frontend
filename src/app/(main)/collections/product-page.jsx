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
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <Skeleton className="aspect-square w-full rounded-2xl bg-neutral-100" />
          <div className="space-y-6 pt-10">
            <Skeleton className="h-12 w-3/4 rounded-full" />
            <Skeleton className="h-8 w-1/4 rounded-full" />
            <Skeleton className="h-5 w-full rounded-full" />
            <Skeleton className="h-5 w-5/6 rounded-full" />
            <div className="flex gap-4 pt-8">
              <Skeleton className="h-14 flex-1 rounded-full" />
              <Skeleton className="h-14 flex-1 rounded-full" />
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
      <main className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="flex max-w-sm flex-col items-center gap-4 rounded-[12px] border border-[#e5e5e5] p-10 text-center">
          <AlertCircle className="h-10 w-10 text-[#a3a3a3]" />
          <p className="font-sans text-[14px] font-medium text-[#737373]">Product not found</p>
          <Link href="/shop" className="font-sans text-[14px] font-medium text-black underline underline-offset-4 transition-opacity hover:opacity-70">
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
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* STICKY GALLERY LEFT SIDE */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <Carousel setApi={setApi} className="group w-full">
              <CarouselContent>
                {currentImages.map((img, idx) => (
                  <CarouselItem key={`${img}-${idx}`}>
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#f5f5f5]">
                      <Image
                        src={img}
                        alt={`${attrs.title || 'Product'} — image ${idx + 1}`}
                        fill
                        priority={idx === 0}
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-contain mix-blend-multiply"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            
            {/* Minimal thumbnails */}
            {currentImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
                {currentImages.map((img, idx) => (
                  <button
                    key={`${img}-thumb-${idx}`}
                    onClick={() => api?.scrollTo(idx)}
                    className={cn(
                      'relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-[#f5f5f5] transition-all',
                      current === idx ? 'ring-2 ring-black ring-offset-2' : 'opacity-60 hover:opacity-100'
                    )}
                    aria-label={`Go to image ${idx + 1}`}
                  >
                    <Image src={img} alt="" fill sizes="100px" className="object-contain p-2 mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DETAILS RIGHT SIDE */}
          <div className="flex flex-col pt-4 lg:pt-10 space-y-8">
            
            <div className="flex flex-wrap gap-2">
              {attrs.is_bestseller && (
                <span className="rounded-full bg-black px-4 py-1.5 font-sans text-[12px] font-medium text-white shadow-sm">Bestseller</span>
              )}
              {attrs.is_new_arrival && (
                <span className="rounded-full bg-neutral-100 px-4 py-1.5 font-sans text-[12px] font-medium text-black">New Arrival</span>
              )}
              {attrs.is_featured && (
                <span className="rounded-full bg-neutral-100 px-4 py-1.5 font-sans text-[12px] font-medium text-[#737373]">Featured</span>
              )}
            </div>

            <div className="space-y-4">
              <h1 className="font-display text-[40px] font-medium leading-[1.1] text-black md:text-[48px] lg:text-[56px] tracking-tight">
                {attrs.title}
              </h1>
              {attrs.shortDescription && (
                <p className="font-sans text-[18px] leading-relaxed text-[#737373]">{attrs.shortDescription}</p>
              )}
            </div>

            <div className="flex items-baseline gap-4 pt-2">
              <span className="font-sans text-[32px] font-medium text-black">{formatCurrency(price)}</span>
              {hasDiscount && (
                <>
                  <span className="font-sans text-[20px] text-[#a3a3a3] line-through">{formatCurrency(originalPrice)}</span>
                  <span className="font-sans text-[14px] font-medium text-[#ff6900] border border-[#ff6900] px-2 py-0.5 rounded-sm bg-orange-50/50">−{discountPct}% OFF</span>
                </>
              )}
            </div>

            {/* Variant Selectors */}
            {Object.keys(optionGroups).length > 0 && (
              <div className="space-y-6 pt-4">
                {Object.entries(optionGroups).map(([name, values]) => (
                  <div key={name}>
                    <label className="mb-3 block font-sans text-[14px] font-medium text-black uppercase tracking-wider">
                      {name}: <span className="text-[#737373]">{selectedOptions[name]}</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {values.map(({ value }) => (
                        <button
                          key={value}
                          onClick={() => setSelectedOptions(prev => ({ ...prev, [name]: value }))}
                          className={cn(
                            'rounded-full px-6 py-3 font-sans text-[15px] font-medium transition-colors',
                            selectedOptions[name] === value
                              ? 'bg-black text-white'
                              : 'bg-[#f5f5f5] text-black hover:bg-[#e5e5e5]'
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

            {/* Specs / Desc */}
            {(attrs.description || attrs.specifications?.length > 0) && (
              <div className="pt-8 border-t border-[#f5f5f5] space-y-8">
                {attrs.description && (
                  <p className="font-sans text-[16px] leading-relaxed text-[#555] whitespace-pre-wrap">{attrs.description}</p>
                )}
                {attrs.specifications?.length > 0 && (
                  <div className="space-y-3">
                    <span className="font-sans text-[16px] font-medium text-black uppercase tracking-wider block mb-4">Specifications</span>
                    {attrs.specifications.map((spec, i) => (
                      <div key={i} className="flex justify-between border-b border-[#f5f5f5] pb-2 font-sans text-[14px]">
                        <span className="text-[#737373]">{spec.key}</span>
                        <span className="font-medium text-black">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-row gap-2 sm:gap-4 pt-8 w-full lg:w-max">
              <button
                onClick={handleAddToCart}
                disabled={stock === 0 || addToCartMutation.isPending}
                className="flex flex-1 lg:flex-none lg:w-[160px] items-center justify-center rounded-md bg-[#222] px-2 sm:px-6 py-2.5 sm:py-3 font-sans text-[13px] sm:text-[14px] font-medium text-white transition-opacity hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                {addToCartMutation.isPending ? 'Adding...' : (stock > 0 ? 'Add to cart' : 'Out of stock')}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={stock === 0 || addToCartMutation.isPending}
                className="flex flex-1 lg:flex-none lg:w-[160px] items-center justify-center rounded-md bg-white border border-gray-400 px-2 sm:px-6 py-2.5 sm:py-3 font-sans text-[13px] sm:text-[14px] font-medium text-black transition-colors hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                Buy now
              </button>
            </div>
            
            <div className="pt-4 text-center">
              <p className="font-sans text-[14px] text-[#737373] flex items-center justify-center gap-2">
                <PackageSearch className="h-4 w-4" /> 
                Free shipping & hassle-free returns
              </p>
            </div>
          </div>
        </div>

        {/* Related */}
        {relatedRes?.data?.length > 0 && (
          <div className="pt-24 mt-24 border-t border-[#f5f5f5]">
            <h3 className="mb-10 text-center font-display text-[32px] font-medium tracking-tight text-black">You might also like</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {relatedRes.data.map(item => {
                const rImg = item.images?.[0]?.url || 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?q=80&w=800';
                return (
                  <article key={item._id} className="group relative bg-white transition-all hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 cursor-pointer flex flex-col p-3 sm:p-6 min-h-[250px] sm:min-h-[350px] h-full rounded-lg overflow-hidden border border-[#e5e5e5]">
                    
                    <div className="flex flex-col items-center text-center z-10 pt-2 sm:pt-4">
                      <h3 className="text-[14px] sm:text-[18px] md:text-[20px] font-medium text-[#333] mb-1 sm:mb-2 truncate w-full px-1 sm:px-2">{item.title}</h3>
                      <div className="flex items-center gap-2 mb-2 sm:mb-4">
                        <span className="text-[14px] sm:text-[16px] text-[#333]">{formatCurrency(item.price || 0)}</span>
                      </div>
                      <div className="flex gap-2 w-full justify-center mt-1 sm:mt-2 mb-3 sm:mb-6 relative z-20">
                        <Link href={`/product/${item.slug || item._id}`} className="bg-white text-black border border-gray-400 text-[12px] sm:text-[13px] px-3 sm:px-4 py-1 sm:py-1.5 rounded-md hover:border-black transition-colors w-max">
                          View Details
                        </Link>
                      </div>
                    </div>

                    <div className="relative w-full h-[100px] sm:h-[150px] md:h-[180px] mt-auto">
                      <Link href={`/product/${item.slug || item._id}`} className="absolute inset-0 z-10" />
                      <Image src={rImg} alt={item.title} fill sizes="(min-width: 1280px) 24vw, (min-width: 1024px) 32vw, 48vw" className="object-contain object-bottom transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
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
    </main>
  );
}
