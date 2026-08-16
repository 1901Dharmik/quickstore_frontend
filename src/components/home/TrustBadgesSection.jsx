"use client";

import { Wrench, RotateCcw, ShieldCheck, MapPin } from 'lucide-react';

export function TrustBadgesSection() {
  const badges = [
    {
      icon: <Wrench className="h-8 w-8 text-[#b0b0b0] group-hover:text-[#ff6900] transition-colors" />,
      title: "Hassle-free replacement",
      desc: "10-day easy replacement policy on mi.com"
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-[#b0b0b0] group-hover:text-[#ff6900] transition-colors" />,
      title: "100% secure payments",
      desc: "We support Cards, Wallets, EMI and COD"
    },
    {
      icon: <MapPin className="h-8 w-8 text-[#b0b0b0] group-hover:text-[#ff6900] transition-colors" />,
      title: "Vast service network",
      desc: "1000 Mi service-centers across 600 cities"
    },
    {
      icon: <RotateCcw className="h-8 w-8 text-[#b0b0b0] group-hover:text-[#ff6900] transition-colors" />,
      title: "Reliable Support",
      desc: "Get 24/7 dedicated customer service"
    }
  ];

  return (
    <section className="w-full bg-white border-b border-[#e5e5e5]">
      <div className="mx-auto max-w-[1226px] px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#e5e5e5]">
          {badges.map((badge, index) => (
            <div key={index} className="group flex items-center justify-center gap-4 py-8 px-4 cursor-pointer">
              {badge.icon}
              <div className="flex flex-col">
                <span className="font-sans text-[16px] text-[#333] font-medium group-hover:text-[#ff6900] transition-colors">
                  {badge.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
