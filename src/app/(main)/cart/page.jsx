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
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Failed to load cart.</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-4 py-12 md:px-8 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
          <Skeleton className="mb-12 h-10 w-56" />
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-36 w-full" />)}
            </div>
            <div className="lg:col-span-4"><Skeleton className="h-80 w-full" /></div>
          </div>
        </div>
      </main>
    );
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-24">
        <div className="flex w-full max-w-sm flex-col items-center text-center">
          <div className="mb-8 flex h-20 w-20 items-center justify-center border border-border">
            <ShoppingBag className="h-8 w-8 text-foreground" />
          </div>
          <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Empty bag
          </span>
          <h2 className="mb-4 font-display text-3xl italic tracking-tight text-foreground">
            Nothing here yet
          </h2>
          <p className="mb-10 text-sm leading-relaxed text-muted-foreground">
            You haven't added anything to your cart yet.
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

  const subtotal = cart?.subtotal || 0;
  const shipping = subtotal >= 500 ? 0 : 99;
  const orderTotal = subtotal + shipping;

  return (
    <main className="min-h-screen bg-background px-4 py-12 md:px-8 lg:px-12">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <Link href="/shop" className="p-1 text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <span className="block font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Your selection
            </span>
            <h1 className="font-display text-3xl italic tracking-tight text-foreground sm:text-4xl">
              Shopping Bag
              <span className="ml-3 font-mono text-base font-normal not-italic text-muted-foreground">
                ({cart.items?.length || 0})
              </span>
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 xl:gap-16">
          {/* Items */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="border-t border-border">
              {cart.items?.map((item) => {
                const product = item.product || {};
                const title = item.variant ? `${product.title} — ${item.variant.title}` : product.title;
                const thumbnail = product.images?.[0]?.url || null;

                return (
                  <div key={item._id} className="flex gap-5 border-b border-border py-7 sm:gap-7">
                    <div className="relative h-28 w-28 shrink-0 border border-border bg-secondary sm:h-36 sm:w-36">
                      {thumbnail ? (
                        <Image src={thumbnail} alt={title} fill className="object-contain p-4 " sizes="144px" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link href={`/product/${product.slug || product._id}`}>
                            <h3 className="text-base font-medium leading-snug text-foreground transition-opacity hover:opacity-60 sm:text-lg">
                              {title}
                            </h3>
                          </Link>
                          <p className="mt-1 font-mono text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                        </div>
                        <button
                          onClick={() => removeMutation.mutate(item._id)}
                          className="p-1 text-muted-foreground transition-colors hover:text-foreground"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() => updateMutation.mutate({ itemId: item._id, quantity: Math.max(1, item.quantity - 1) })}
                            disabled={item.quantity <= 1 || updateMutation.isPending}
                            className="flex h-9 w-9 items-center justify-center text-foreground transition-opacity hover:opacity-60 disabled:opacity-30"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-9 text-center font-mono text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateMutation.mutate({ itemId: item._id, quantity: item.quantity + 1 })}
                            disabled={updateMutation.isPending}
                            className="flex h-9 w-9 items-center justify-center text-foreground transition-opacity hover:opacity-60 disabled:opacity-30"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="font-mono text-sm font-medium text-foreground">{formatCurrency(item.total)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24 border border-border bg-background">
              <div className="border-b border-border bg-foreground px-6 py-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-background">Order summary</span>
              </div>
              <div className="px-6 py-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-mono font-medium text-foreground">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-mono font-medium text-foreground">{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                  </div>
                </div>

                <div className="my-5 border-t border-b border-border py-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground">Total</span>
                    <span className="font-mono text-2xl font-medium text-foreground">{formatCurrency(orderTotal)}</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  disabled={!cart?.items?.length}
                  className="group flex w-full items-center justify-center gap-2 bg-foreground px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <p className="mt-4 flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <Lock className="h-3 w-3" /> Secure Checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
