"use client";

import Link from "next/link";
import { CheckCheck, ArrowRight, Package } from "lucide-react";

export default function OrderSuccess({ orderId }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      {/* Icon */}
      <div className="relative mb-8">
        <div className="flex h-20 w-20 items-center justify-center bg-foreground">
          <CheckCheck className="h-9 w-9 text-background" />
        </div>
        <div className="pointer-events-none absolute -inset-2 border border-border" />
      </div>

      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        Order Confirmed
      </p>
      <h1 className="mb-3 font-display text-3xl italic tracking-tight text-foreground">
        Thank You!
      </h1>
      <p className="mb-10 max-w-xs text-sm leading-relaxed text-muted-foreground">
        Your order has been placed and is being processed. You'll receive a confirmation shortly.
      </p>

      {/* Order number card */}
      <div className="mb-8 w-full max-w-xs border-2 border-foreground">
        <div className="bg-foreground px-4 py-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-background/60">
            Order Reference
          </p>
        </div>
        <div className="bg-background px-4 py-5">
          <p className="font-mono text-xl font-bold tracking-wider text-foreground">
            {orderId}
          </p>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Package className="h-3.5 w-3.5" />
        <span>Tracking details will be sent to your email</span>
      </div>

      <div className="mb-8 w-full border-t border-border" />

      <Link
        href="/shop"
        className="group flex items-center gap-2 bg-foreground px-8 py-4 font-mono text-[10px] uppercase tracking-[0.15em] text-background transition-opacity hover:opacity-80"
      >
        Continue Shopping
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
