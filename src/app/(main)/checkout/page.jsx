"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Skeleton } from "@/components/ui/skeleton";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import OrderSuccess from "@/components/checkout/OrderSuccess";

export default function CheckoutPage() {
  const { data: cart, isPending } = useCart();
  const [orderNumber, setOrderNumber] = useState(null);
  const [coupon, setCoupon] = useState(null);

  if (orderNumber) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md border border-border bg-background">
          <OrderSuccess orderId={orderNumber} />
        </div>
      </main>
    );
  }

  // Empty cart guard
  if (!isPending && (!cart?.items || cart.items.length === 0)) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-24">
        <div className="flex w-full max-w-sm flex-col items-center text-center">
          <div className="mb-8 flex h-20 w-20 items-center justify-center border border-border">
            <ShoppingBag className="h-8 w-8 text-foreground" />
          </div>
          <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Your bag is empty
          </span>
          <h2 className="mb-4 font-display text-3xl italic tracking-tight text-foreground">
            Nothing to checkout
          </h2>
          <p className="mb-10 text-sm leading-relaxed text-muted-foreground">
            Add some items to your cart before proceeding to checkout.
          </p>
          <Link
            href="/shop"
            className="inline-flex w-full items-center justify-center gap-2 bg-foreground px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-80"
          >
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-background px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground">Checkout</h1>
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 bg-foreground" />
            Secure Checkout
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_380px]">
          {/* Left — Form */}
          <div className="border border-border bg-background p-6 md:p-8">
            {isPending ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : (
              <CheckoutForm
                onSuccess={({ orderNumber }) => setOrderNumber(orderNumber)}
                coupon={coupon}
              />
            )}
          </div>

          {/* Right — Summary */}
          <div>
            {isPending ? (
              <Skeleton className="h-96 w-full" />
            ) : (
              <OrderSummary cart={cart} onCouponApplied={setCoupon} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
