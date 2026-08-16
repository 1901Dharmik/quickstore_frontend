"use client";

import Link from 'next/link';
import Image from 'next/image';

const RECOMMENDATIONS = [
  {
    id: 1,
    name: "Series 8 Pro Elite",
    desc: "Titanium casing and sapphire glass.",
    price: "₹14,999",
    oldPrice: "₹19,999",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=600&auto=format&fit=crop",
    type: "large"
  },
  {
    id: 2,
    name: "Active Fit 3",
    desc: "Your daily fitness companion.",
    price: "₹3,499",
    oldPrice: "₹4,999",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=600&auto=format&fit=crop",
    type: "large"
  },
  {
    id: 3,
    name: "Classic Leather Strap",
    price: "₹1,299",
    oldPrice: "₹1,999",
    image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=400&auto=format&fit=crop",
    type: "small"
  },
  {
    id: 4,
    name: "Ceramic Link Band",
    price: "₹2,499",
    oldPrice: "₹3,499",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=400&auto=format&fit=crop",
    type: "small"
  },
  {
    id: 5,
    name: "Wireless Charger Pad",
    price: "₹999",
    oldPrice: "₹1,499",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=400&auto=format&fit=crop",
    type: "small"
  },
  {
    id: 6,
    name: "Screen Protector Set",
    price: "₹499",
    oldPrice: "₹799",
    image: "https://images.unsplash.com/photo-1526045612212-70cb359b22b1?q=80&w=400&auto=format&fit=crop",
    type: "small"
  }
];

export function MoreRecommendationsSection() {
  return (
    <section className="w-full bg-[#f5f5f5] py-12 md:py-20">
      <div className="mx-auto max-w-[1226px] px-4 md:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-[28px] md:text-[32px] font-sans font-medium text-[#333] tracking-tight">More recommendations</h2>
        </div>

        {/* Mixed Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          
          {/* Row 1: Two Double-Width Cards */}
          {RECOMMENDATIONS.filter(item => item.type === 'large').map((product) => (
            <div key={product.id} className="col-span-2 group relative overflow-hidden bg-white rounded-lg transition-all hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 cursor-pointer flex justify-between p-6 md:p-8 min-h-[250px] md:min-h-[300px]">
              <Link href="/shop" className="absolute inset-0 z-10" />
              <div className="flex flex-col h-full w-[55%] z-10 justify-between">
                <div>
                  <h3 className="text-[22px] md:text-[28px] font-bold text-[#333] mb-3 leading-tight">{product.name}</h3>
                  <p className="text-[14px] text-[#777] mb-4">{product.desc}</p>
                </div>
                <div>
                  <p className="text-[12px] text-[#777]">From</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[20px] md:text-[24px] text-[#333] font-bold">{product.price}</span>
                    {product.oldPrice && <span className="text-[14px] text-[#b0b0b0] line-through">{product.oldPrice}</span>}
                  </div>
                </div>
              </div>
              <div className="relative w-[45%] h-full flex items-center justify-end">
                <div className="relative w-full h-[180px] md:h-[220px]">
                  <Image 
                    src={product.image} 
                    alt={product.name}
                    fill
                    className="object-contain object-right transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Row 2: Four Single-Width Cards */}
          {RECOMMENDATIONS.filter(item => item.type === 'small').map((product) => (
            <div key={product.id} className="col-span-1 group relative bg-white transition-all hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 rounded-lg cursor-pointer flex flex-col p-6 min-h-[250px] md:min-h-[300px]">
              <Link href="/shop" className="absolute inset-0 z-10" />
              
              <div className="z-10">
                <h3 className="text-[16px] md:text-[18px] font-bold text-[#333] mb-2 truncate">{product.name}</h3>
                <p className="text-[12px] text-[#777] mb-2 truncate">{product.desc || '\u00A0'}</p>
              </div>

              <div className="mt-auto flex justify-between items-end">
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

        </div>
      </div>
    </section>
  );
}
