"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const TABS = ["Recommend", "Ceramic Series", "Sports Active", "Classic Hybrid"];

// Dummy products to populate the grid
const PRODUCTS = [
  {
    id: 1,
    name: "Series 8 Pro Elite",
    desc: "Sapphire glass. 14-day battery.",
    price: "₹14,999",
    oldPrice: "₹19,999",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=600&auto=format&fit=crop",
    badge: "New",
  },
  {
    id: 2,
    name: "Sports Active 3",
    desc: "Built for the extreme.",
    price: "₹5,499",
    oldPrice: "₹7,999",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=400&auto=format&fit=crop",
    badge: "-30%",
  },
  {
    id: 3,
    name: "Hybrid Classic",
    desc: "Mechanical hands, smart heart.",
    price: "₹8,999",
    oldPrice: "₹11,999",
    image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Ceramic Lite",
    desc: "Elegance on your wrist.",
    price: "₹12,499",
    oldPrice: "₹15,000",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Band 7 Pro",
    desc: "The ultimate fitness tracker.",
    price: "₹3,999",
    oldPrice: "₹4,999",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Titanium Edition",
    desc: "Lightweight, ultra-strong.",
    price: "₹21,999",
    oldPrice: "₹25,999",
    image: "https://images.unsplash.com/photo-1526045612212-70cb359b22b1?q=80&w=400&auto=format&fit=crop",
  }
];

export function WatchTabbedSection() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

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
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[15px] transition-colors relative pb-1 ${
                  activeTab === tab 
                    ? 'text-[#ff6900] border-b-2 border-[#ff6900] font-medium' 
                    : 'text-[#333] hover:text-[#ff6900]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          
          {/* Left Large Card (spans 2 cols, 1 row on desktop) */}
          <div className="col-span-2 group relative overflow-hidden bg-white transition-all rounded-lg hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 cursor-pointer flex justify-between p-6 md:p-8 min-h-[250px] md:min-h-[300px]">
            <Link href="/shop" className="absolute inset-0 z-10" />
            <div className="flex flex-col h-full w-[55%] z-10 justify-between">
              <div>
                {PRODUCTS[0].badge && (
                  <span className="text-[#ff6900] text-[12px] font-bold mb-1 block">
                    {PRODUCTS[0].badge}
                  </span>
                )}
                <h3 className="text-[22px] md:text-[28px] font-bold text-[#333] mb-3 leading-tight">{PRODUCTS[0].name}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-[#fff3e5] text-[#d65500] text-[12px] px-2 py-1 font-medium rounded-sm">Save ₹ 2,000</span>
                  <span className="bg-[#fff3e5] text-[#d65500] text-[12px] px-2 py-1 font-medium rounded-sm">Exchange Bonus</span>
                </div>
              </div>
              <div>
                <p className="text-[12px] text-[#777]">From</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-[20px] md:text-[24px] text-[#333] font-bold">{PRODUCTS[0].price}</span>
                  {PRODUCTS[0].oldPrice && <span className="text-[14px] text-[#b0b0b0] line-through">{PRODUCTS[0].oldPrice}</span>}
                </div>
              </div>
            </div>
            <div className="relative w-[45%] h-full flex items-center justify-end">
              <div className="relative w-full h-[180px] md:h-[220px]">
                <Image 
                  src={PRODUCTS[0].image} 
                  alt={PRODUCTS[0].name}
                  fill
                  className="object-contain object-right transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Small Cards */}
          {[PRODUCTS[1], PRODUCTS[2], PRODUCTS[3], PRODUCTS[4], PRODUCTS[5]].map((product) => (
            <div key={product.id} className="col-span-1 group relative bg-white transition-all rounded-lg hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 cursor-pointer flex flex-col p-6 min-h-[250px] md:min-h-[300px]">
              <Link href="/shop" className="absolute inset-0 z-10" />
              
              <div className="z-10">
                <h3 className="text-[16px] md:text-[18px] font-bold text-[#333] mb-2 truncate">{product.name}</h3>
                {product.badge ? (
                  <span className="bg-[#fff3e5] text-[#d65500] text-[12px] px-2 py-1 font-medium rounded-sm inline-block mb-2">
                    {product.badge}
                  </span>
                ) : (
                  <p className="text-[12px] text-[#777] mb-2 truncate">{product.desc}</p>
                )}
              </div>

              <div className="mt-auto flex justify-between items-end ">
                <div className="flex flex-col z-10">
                  <span className="text-[12px] text-[#777]">From</span>
                  <div className="flex flex-col">
                    <span className="text-[16px] md:text-[18px] text-[#333] font-bold">{product.price}</span>
                    {product.oldPrice && <span className="text-[12px] text-[#b0b0b0] line-through mt-0.5">{product.oldPrice}</span>}
                  </div>
                </div>
                <div className="relative w-[100px] h-[100px] md:w-[130px] md:h-[130px] -mr-2">
                  <Image src={product.image} alt={product.name} fill className="object-contain object-bottom transition-transform duration-500 group-hover:scale-110" />
                </div>
              </div>
            </div>
          ))}

          {/* View All Redirect Card */}
          <div className="col-span-1 group relative bg-[#f8f9fa] transition-all rounded-lg hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center p-6 text-center min-h-[250px] md:min-h-[300px]">
            <Link href="/shop" className="absolute inset-0 z-10" />
            
            <div className="flex items-center gap-2 mb-6 z-10">
              <h3 className="text-[18px] md:text-[20px] font-bold text-[#333]">All Products</h3>
              <div className="h-6 w-6 rounded-full border border-[#333] flex items-center justify-center text-[#333] transition-colors group-hover:bg-[#333] group-hover:text-white">
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>

            <div className="relative w-full h-[120px] md:h-[150px] flex justify-center items-center">
              {/* Stacked Images Effect */}
              <div className="absolute right-[10%] w-[60%] h-full z-20">
                <Image src={PRODUCTS[1].image} alt="Product" fill className="object-contain" />
              </div>
              <div className="absolute left-[10%] top-[20%] w-[40%] h-[60%] z-10 opacity-60">
                <Image src={PRODUCTS[2].image} alt="Product" fill className="object-contain" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
