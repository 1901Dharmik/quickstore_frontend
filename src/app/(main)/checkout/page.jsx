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
      <main className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
        <div className="w-full max-w-md rounded-[12px] border border-[#e5e5e5] bg-white">
          <OrderSuccess orderId={orderNumber} />
        </div>
      </main>
    );
  }

  // Empty cart guard
  if (!isPending && (!cart?.items || cart.items.length === 0)) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-24">
        <div className="flex w-full max-w-sm flex-col items-center text-center">
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#fafafa]">
            <ShoppingBag className="h-8 w-8 text-[#737373]" />
          </div>
          <h2 className="mb-3 font-display text-[28px] font-medium text-black">
            Nothing to checkout
          </h2>
          <p className="mb-10 font-sans text-[16px] text-[#737373]">
            Add some items to your cart before proceeding to checkout.
          </p>
          <Link
            href="/shop"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-6 font-sans text-[14px] font-medium text-white transition-colors hover:bg-[#090909]"
          >
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="border-b border-[#e5e5e5] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <h1 className="font-sans text-[16px] font-medium text-black">Checkout</h1>
          <div className="flex items-center gap-2 font-sans text-[14px] text-[#737373]">
            <span className="inline-block h-2 w-2 rounded-full bg-[#10b981]" />
            Secure Checkout
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-6">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_400px]">
          {/* Left — Form */}
          <div className="rounded-[12px] border border-[#e5e5e5] bg-white p-6 md:p-8">
            {isPending ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-full" />)}
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
              <Skeleton className="h-96 w-full rounded-[12px]" />
            ) : (
              <OrderSummary cart={cart} onCouponApplied={setCoupon} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
