"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, ArrowLeft, Lock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '@/hooks/use-cart';

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}

export default function CartPage() {
  const router = useRouter();
  const { data: cart, isPending: loading, isError } = useCart();
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4">
        <p className="font-sans text-[14px] text-[#737373]">Failed to load cart.</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-4 py-20 md:px-8 lg:px-12">
        <div className="mx-auto max-w-[1200px]">
          <Skeleton className="mb-12 h-10 w-56 rounded-full" />
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-36 w-full rounded-[12px]" />)}
            </div>
            <div className="lg:col-span-4"><Skeleton className="h-80 w-full rounded-[12px]" /></div>
          </div>
        </div>
      </main>
    );
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-24">
        <div className="flex w-full max-w-sm flex-col items-center text-center">
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#fafafa]">
            <ShoppingBag className="h-8 w-8 text-[#737373]" />
          </div>
          <h2 className="mb-3 font-display text-[28px] font-medium text-black">
            Nothing here yet
          </h2>
          <p className="mb-10 font-sans text-[16px] text-[#737373]">
            You haven't added anything to your cart yet.
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

  const subtotal = cart?.subtotal || 0;
  const shipping = subtotal >= 500 ? 0 : 99;
  const orderTotal = subtotal + shipping;

  return (
    <main className="min-h-screen bg-white px-4 py-20 md:px-8 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="mb-12 flex items-center gap-4 border-b border-[#e5e5e5] pb-8">
          <Link href="/shop" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fafafa] text-[#737373] transition-colors hover:text-black hover:bg-[#f5f5f5]">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-display text-[36px] font-medium text-black flex items-baseline gap-3">
              Shopping Bag
              <span className="font-sans text-[18px] text-[#737373] font-normal">
                ({cart.items?.length || 0})
              </span>
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 xl:gap-16">
          {/* Items */}
          {/* Items */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="flex flex-col gap-6">
              {cart.items?.map((item) => {
                const product = item.product || {};
                const title = item.variant ? `${product.title} — ${item.variant.title}` : product.title;
                const thumbnail = product.images?.[0]?.url || null;

                return (
                  <div key={item._id} className="flex gap-5 sm:gap-7 rounded-[12px] border border-[#e5e5e5] p-4 sm:p-6">
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[8px] bg-[#fafafa] sm:h-32 sm:w-32">
                      {thumbnail ? (
                        <Image src={thumbnail} alt={title} fill className="object-contain p-4" sizes="128px" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-[#a3a3a3]" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link href={`/product/${product.slug || product._id}`}>
                            <h3 className="font-sans text-[16px] font-medium leading-snug text-black transition-opacity hover:opacity-60">
                              {title}
                            </h3>
                          </Link>
                          <p className="mt-1 font-sans text-[14px] text-[#737373]">{formatCurrency(item.price)}</p>
                        </div>
                        <button
                          onClick={() => removeMutation.mutate(item._id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#737373] transition-colors hover:bg-[#fafafa] hover:text-black"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-[#e5e5e5]">
                          <button
                            onClick={() => updateMutation.mutate({ itemId: item._id, quantity: Math.max(1, item.quantity - 1) })}
                            disabled={item.quantity <= 1 || updateMutation.isPending}
                            className="flex h-8 w-8 items-center justify-center text-black transition-opacity hover:opacity-60 disabled:opacity-30"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center font-sans text-[14px]">{item.quantity}</span>
                          <button
                            onClick={() => updateMutation.mutate({ itemId: item._id, quantity: item.quantity + 1 })}
                            disabled={updateMutation.isPending}
                            className="flex h-8 w-8 items-center justify-center text-black transition-opacity hover:opacity-60 disabled:opacity-30"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="font-sans text-[16px] font-medium text-black">{formatCurrency(item.total)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          {/* Summary */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24 rounded-[12px] border border-[#e5e5e5] bg-[#fafafa] p-6">
              <h3 className="font-sans text-[18px] font-medium text-black mb-6">Order summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between font-sans text-[14px]">
                  <span className="text-[#737373]">Subtotal</span>
                  <span className="font-medium text-black">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between font-sans text-[14px]">
                  <span className="text-[#737373]">Shipping</span>
                  <span className="font-medium text-black">{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                </div>
              </div>

              <div className="my-6 border-t border-[#e5e5e5] pt-6">
                <div className="flex items-baseline justify-between">
                  <span className="font-sans text-[16px] font-medium text-black">Total</span>
                  <span className="font-display text-[24px] font-medium text-black">{formatCurrency(orderTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                disabled={!cart?.items?.length}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-6 font-sans text-[14px] font-medium text-white transition-colors hover:bg-[#090909] disabled:opacity-30"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="mt-4 flex items-center justify-center gap-2 font-sans text-[12px] text-[#737373]">
                <Lock className="h-3.5 w-3.5" /> Secure Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
