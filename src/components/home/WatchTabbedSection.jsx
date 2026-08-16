"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, ShoppingCart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/api/product';
import { useAddToCart } from '@/hooks/use-cart';

const TABS = [
  { name: 'Men', slug: 'man' },
  { name: 'Women', slug: 'woman' },
  { name: 'Couple', slug: 'couple' },
  { name: 'Kids', slug: 'kids' }
];

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}

export function WatchTabbedSection() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const router = useRouter();
  const addToCartMutation = useAddToCart();

  // Fetch products
  const { data: rawProductsRes, isLoading } = useQuery({
    queryKey: ['products', 'home'],
    queryFn: () => fetchProducts({ limit: 200 }),
    staleTime: 1000 * 60 * 5,
  });

  const products = useMemo(() => {
    return (rawProductsRes?.data || []).map(p => ({
      id: p._id || p.id,
      slug: p.slug || p._id,
      name: p.title || 'Product',
      desc: p.description?.substring(0, 50) || 'Premium smart watch',
      price: p.price || 0,
      oldPrice: p.compare_at_price || p.attributes?.compare_at_price || p.price || 0,
      image: p.images?.[0]?.url || 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?q=80&w=800',
      gender: p.gender || 'man',
      badge: p.originalPrice > p.price ? 'Sale' : null,
    }));
  }, [rawProductsRes]);

  const tabProducts = useMemo(() => {
    return products.filter(p => p.gender === activeTab.slug).slice(0, 6);
  }, [products, activeTab]);

  const handleAddToCart = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    addToCartMutation.mutate({ product_id: productId, quantity: 1 });
  };

  const handleKnowMore = (e, slug) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/product/${slug}`);
  };

  return (
    <section className="w-full bg-[#f5f5f5] py-12 md:py-20">
      <div className="mx-auto max-w-[1226px] px-4 md:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-[28px] md:text-[32px] font-sans font-medium text-[#333] mb-6 tracking-tight">Premium Watches</h2>
          
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            {TABS.map((tab) => (
              <button
                key={tab.slug}
                onClick={() => setActiveTab(tab)}
                className={`text-[15px] transition-colors relative pb-1 ${
                  activeTab.slug === tab.slug 
                    ? 'text-[#ff6900] border-b-2 border-[#ff6900] font-medium' 
                    : 'text-[#333] hover:text-[#ff6900]'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#d4d4d4] border-t-[#ff6900]" />
          </div>
        ) : (
          /* Grid Layout */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            
            {/* Left Large Card (spans 2 cols, 1 row on desktop) */}
            {tabProducts[0] && (
              <div className="col-span-2 group relative overflow-hidden bg-white transition-all rounded-lg hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 cursor-pointer flex flex-col md:flex-row justify-between p-6 md:p-8 min-h-[250px] md:min-h-[300px]">
                <Link href={`/product/${tabProducts[0].slug}`} className="absolute inset-0 z-10" />
                <div className="flex flex-col h-full w-full md:w-[55%] z-10 justify-between mb-4 md:mb-0">
                  <div>
                    {tabProducts[0].badge && (
                      <span className="text-[#ff6900] text-[12px] font-bold mb-1 block">
                        {tabProducts[0].badge}
                      </span>
                    )}
                    <h3 className="text-[22px] md:text-[28px] font-bold text-[#333] mb-3 leading-tight">{tabProducts[0].name}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tabProducts[0].oldPrice > tabProducts[0].price && (
                        <span className="bg-[#fff3e5] text-[#d65500] text-[12px] px-2 py-1 font-medium rounded-sm">Save {formatCurrency(tabProducts[0].oldPrice - tabProducts[0].price)}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#777]">From</p>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-[20px] md:text-[24px] text-[#333] font-bold">{formatCurrency(tabProducts[0].price)}</span>
                      {tabProducts[0].oldPrice > tabProducts[0].price && <span className="text-[14px] text-[#b0b0b0] line-through">{formatCurrency(tabProducts[0].oldPrice)}</span>}
                    </div>
                    {/* Action Buttons */}
                    <div className="flex gap-2 w-full relative z-20">
                      <button 
                        onClick={(e) => handleAddToCart(e, tabProducts[0].id)}
                        disabled={addToCartMutation.isPending}
                        className="bg-[#222] text-white text-[13px] px-4 py-2 rounded-md hover:bg-black transition-colors"
                      >
                        {addToCartMutation.isPending ? 'Adding...' : 'Add to cart'}
                      </button>
                      <button 
                        onClick={(e) => handleKnowMore(e, tabProducts[0].slug)}
                        className="bg-white text-black border border-gray-400 text-[13px] px-4 py-2 rounded-md hover:border-black transition-colors"
                      >
                        Know more
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative w-full md:w-[45%] h-[150px] md:h-full flex items-center justify-end">
                  <div className="relative w-full h-full">
                    <Image 
                      src={tabProducts[0].image} 
                      alt={tabProducts[0].name}
                      fill
                      className="object-contain object-right md:object-center transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Small Cards */}
            {tabProducts.slice(1, 5).map((product) => (
              <div key={product.id} className="col-span-1 group relative bg-white transition-all rounded-lg hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 cursor-pointer flex flex-col p-4 md:p-6 min-h-[300px]">
                <Link href={`/product/${product.slug}`} className="absolute inset-0 z-10" />
                
                <div className="z-10">
                  <h3 className="text-[16px] md:text-[18px] font-bold text-[#333] mb-2 truncate">{product.name}</h3>
                  {product.badge ? (
                    <span className="bg-[#fff3e5] text-[#d65500] text-[12px] px-2 py-1 font-medium rounded-sm inline-block mb-2">
                      {product.badge}
                    </span>
                  ) : (
                    <p className="text-[12px] text-[#777] mb-2 truncate" title={product.desc}>{product.desc}</p>
                  )}
                </div>

                <div className="mt-auto flex justify-between items-end mb-4">
                  <div className="flex flex-col z-10">
                    <span className="text-[12px] text-[#777]">From</span>
                    <div className="flex flex-col">
                      <span className="text-[16px] md:text-[18px] text-[#333] font-bold">{formatCurrency(product.price)}</span>
                      {product.oldPrice > product.price && <span className="text-[12px] text-[#b0b0b0] line-through mt-0.5">{formatCurrency(product.oldPrice)}</span>}
                    </div>
                  </div>
                  <div className="relative w-[80px] h-[80px] md:w-[100px] md:h-[100px] -mr-2">
                    <Image src={product.image} alt={product.name} fill className="object-contain object-bottom transition-transform duration-500 group-hover:scale-110" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col xl:flex-row gap-2 w-full mt-2 relative z-20">
                  <button 
                    onClick={(e) => handleAddToCart(e, product.id)}
                    disabled={addToCartMutation.isPending}
                    className="flex-1 bg-[#222] text-white text-[11px] md:text-[12px] px-2 py-1.5 rounded-md hover:bg-black transition-colors flex items-center justify-center gap-1"
                  >
                    <ShoppingCart className="h-3 w-3" /> Add
                  </button>
                  <button 
                    onClick={(e) => handleKnowMore(e, product.slug)}
                    className="flex-1 bg-white text-black border border-gray-400 text-[11px] md:text-[12px] px-2 py-1.5 rounded-md hover:border-black transition-colors text-center"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}

            {/* View All Redirect Card */}
            {tabProducts.length > 0 && (
              <div className="col-span-1 group relative bg-[#f8f9fa] transition-all rounded-lg hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center p-6 text-center min-h-[300px]">
                <Link href={`/shop?category=${activeTab.slug}`} className="absolute inset-0 z-10" />
                
                <div className="flex items-center gap-2 mb-6 z-10">
                  <h3 className="text-[18px] md:text-[20px] font-bold text-[#333]">All in {activeTab.name}</h3>
                  <div className="h-6 w-6 rounded-full border border-[#333] flex items-center justify-center text-[#333] transition-colors group-hover:bg-[#333] group-hover:text-white">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>

                <div className="relative w-full h-[120px] md:h-[150px] flex justify-center items-center">
                  {/* Stacked Images Effect */}
                  {tabProducts[1] && (
                    <div className="absolute right-[10%] w-[60%] h-full z-20">
                      <Image src={tabProducts[1].image} alt="Product" fill className="object-contain" />
                    </div>
                  )}
                  {tabProducts[2] && (
                    <div className="absolute left-[10%] top-[20%] w-[40%] h-[60%] z-10 opacity-60">
                      <Image src={tabProducts[2].image} alt="Product" fill className="object-contain" />
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {tabProducts.length === 0 && (
              <div className="col-span-2 md:col-span-4 flex flex-col items-center justify-center py-20 text-[#777]">
                <p>No products found in this category.</p>
              </div>
            )}

          </div>
        )}
      </div>
    </section>
  );
}
