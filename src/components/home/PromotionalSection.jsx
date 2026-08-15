'use client';

import { useState } from 'react';
import { Gift, Copy, CheckCircle2 } from 'lucide-react';

const COUPONS = [
  {
    id: 1,
    code: 'RAKHI20',
    title: 'Siblings Special',
    description: 'Get Flat 20% OFF on all premium smartwatches. Celebrate the bond with time.',
    discount: '20% OFF',
    bgColor: 'bg-[#fff5f5]',
    borderColor: 'border-[#fecdd3]',
    textColor: 'text-[#e11d48]',
  },
  {
    id: 2,
    code: 'FESTIVE500',
    title: 'Festive Savings',
    description: 'Save ₹500 on your purchase above ₹2000. Perfect gift for your sister.',
    discount: '₹500 OFF',
    bgColor: 'bg-[#f0fdfa]',
    borderColor: 'border-[#99f6e4]',
    textColor: 'text-[#0d9488]',
  },
  {
    id: 3,
    code: 'GIFTWATCH',
    title: 'Free Express Delivery',
    description: 'Order today and get free express shipping guaranteed before Rakshabandhan.',
    discount: 'FREE SHIP',
    bgColor: 'bg-[#fffbeb]',
    borderColor: 'border-[#fde68a]',
    textColor: 'text-[#d97706]',
  },
  {
    id: 4,
    code: 'BROTHER30',
    title: 'Brother\'s Promise',
    description: 'Surprise him with a high-tech smart watch! Get 30% OFF on the premium sports collection.',
    discount: '30% OFF',
    bgColor: 'bg-[#eff6ff]',
    borderColor: 'border-[#bfdbfe]',
    textColor: 'text-[#2563eb]',
  },
  {
    id: 5,
    code: 'LUXURY1000',
    title: 'Luxury Tier Upgrades',
    description: 'Elevate the gift. Flat ₹1000 OFF on all Elite & Ceramic series timepieces this week.',
    discount: '₹1000 OFF',
    bgColor: 'bg-[#f5f3ff]',
    borderColor: 'border-[#ddd6fe]',
    textColor: 'text-[#7c3aed]',
  },
  {
    id: 6,
    code: 'BANDSFORALL',
    title: 'Free Extra Band',
    description: 'Add an extra strap to your cart and apply this code to get it absolutely free with any watch.',
    discount: '100% OFF',
    bgColor: 'bg-[#fcf8ff]',
    borderColor: 'border-[#f5d0fe]',
    textColor: 'text-[#c026d3]',
  },
];

export const PromotionalSection = () => {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section className="w-full bg-white px-4 py-20 md:px-8 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="mb-12 text-center md:mb-16">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0f0] text-[#e11d48]">
            <Gift className="h-6 w-6" />
          </div>
          <h2 className="mb-4 font-display text-4xl font-semibold tracking-tight text-black md:text-5xl">
            Rakshabandhan Exclusive
          </h2>
          <p className="mx-auto max-w-2xl font-sans text-lg text-[#737373]">
            Celebrate the eternal bond with our exclusive festive offers. Copy a code below and apply it at checkout to unlock your gift.
          </p>
        </div>

        {/* Coupons Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {COUPONS.map((coupon) => (
            <div
              key={coupon.id}
              className={`relative overflow-hidden rounded-2xl border ${coupon.borderColor} ${coupon.bgColor} p-8 transition-transform hover:-translate-y-1`}
            >
              {/* Decorative circle */}
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-10 blur-2xl bg-current" style={{ color: coupon.textColor }} />
              
              <div className="relative z-10">
                <span className={`mb-4 inline-block rounded-full bg-white px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest ${coupon.textColor} shadow-sm`}>
                  {coupon.discount}
                </span>
                
                <h3 className="mb-3 font-sans text-2xl font-bold text-black">
                  {coupon.title}
                </h3>
                
                <p className="mb-8 font-sans text-[15px] leading-relaxed text-[#525252]">
                  {coupon.description}
                </p>

                <div className="flex items-center justify-between rounded-xl bg-white p-2 pl-4 shadow-sm">
                  <span className="font-mono text-lg font-bold tracking-wider text-black">
                    {coupon.code}
                  </span>
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className={`flex h-10 items-center gap-2 rounded-lg px-4 font-sans text-sm font-medium transition-all ${
                      copiedCode === coupon.code
                        ? 'bg-[#10b981] text-white'
                        : 'bg-black text-white hover:bg-[#090909]'
                    }`}
                  >
                    {copiedCode === coupon.code ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
