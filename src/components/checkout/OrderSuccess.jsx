"use client";

import Link from "next/link";
import { CheckCheck, ArrowRight, Package } from "lucide-react";

export default function OrderSuccess({ orderId }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      {/* Icon */}
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#fafafa]">
        <CheckCheck className="h-10 w-10 text-[#10b981]" />
      </div>

      <h1 className="mb-3 font-sans text-[36px] font-medium text-black">
        Thank You!
      </h1>
      <p className="mb-10 max-w-xs font-sans text-[16px] leading-relaxed text-[#737373]">
        Your order has been placed and is being processed. You'll receive a confirmation shortly.
      </p>

      {/* Order number card */}
      <div className="mb-8 w-full max-w-xs overflow-hidden rounded-[12px] border border-[#e5e5e5] bg-[#fafafa]">
        <div className="border-b border-[#e5e5e5] bg-white px-4 py-3">
          <p className="font-sans text-[14px] font-medium text-[#737373]">
            Order Reference
          </p>
        </div>
        <div className="px-4 py-5">
          <p className="font-mono text-[20px] font-bold tracking-wider text-black">
            {orderId}
          </p>
        </div>
      </div>

      <div className="mb-10 flex items-center gap-2 font-sans text-[14px] text-[#737373]">
        <Package className="h-4 w-4" />
        <span>Tracking details will be sent to your email</span>
      </div>

      <Link
        href="/shop"
        className="group flex h-12 items-center justify-center gap-2 rounded-full bg-black px-8 font-sans text-[14px] font-medium text-white transition-opacity hover:opacity-80"
      >
        Continue Shopping
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
