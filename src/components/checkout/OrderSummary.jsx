"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Tag, X, Check } from "lucide-react";
import { useValidateCoupon } from "@/hooks/use-coupon";
import { useUser } from "@/hooks/use-auth";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function OrderSummary({ cart, onCouponApplied }) {
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discount_value, discount_type, free_shipping }
  const { mutate: validateCoupon, isPending: validating } = useValidateCoupon();
  const { user } = useUser();

  const subtotal = cart?.subtotal || 0;
  const itemCount = cart?.total_items || 0;

  const couponDiscount = appliedCoupon?.discount_value || 0;
  const freeShipping = appliedCoupon?.free_shipping || false;
  const baseShipping = subtotal >= 500 ? 0 : 99;
  const shipping = freeShipping ? 0 : baseShipping;
  const total = subtotal + shipping - couponDiscount;

  const handleApply = () => {
    if (!couponInput.trim()) return;
    const items = (cart?.items || []).map((item) => ({
      product: item.product?._id || item.product,
      quantity: item.quantity,
      price: item.price,
    }));

    validateCoupon(
      {
        code: couponInput.trim(),
        items,
        userId: user?._id || null,
        guestId: typeof window !== "undefined" ? localStorage.getItem("guest_id") : null,
      },
      {
        onSuccess: (res) => {
          const coupon = res.data;
          setAppliedCoupon(coupon);
          onCouponApplied?.({
            code: coupon.code,
            discount: coupon.discount_value || 0,
            free_shipping: coupon.free_shipping || false,
          });
        },
      }
    );
  };

  const handleRemove = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    onCouponApplied?.(null);
  };

  return (
    <div className="sticky top-28 border border-border">
      {/* Header */}
      <div className="flex items-center justify-between bg-foreground px-5 py-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-background">Your Order</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-background/50">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Items */}
      <div className="max-h-72 divide-y divide-border overflow-y-auto">
        {cart?.items?.length ? (
          cart.items.map((item) => {
            const product = item.product || {};
            const title = item.variant ? `${product.title} — ${item.variant.title}` : product.title;
            const thumbnail = product.images?.[0]?.url || null;
            return (
              <div key={item._id} className="flex items-center gap-3 px-5 py-4">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden border border-border bg-secondary">
                  {thumbnail ? (
                    <Image src={thumbnail} alt={title} fill className="object-contain p-1 grayscale" sizes="56px" />
                  ) : (
                    <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-foreground font-mono text-[9px] font-bold text-background">
                    {item.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium leading-snug text-foreground">{title}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{formatCurrency(item.price)} each</p>
                </div>
                <p className="shrink-0 font-mono text-sm font-medium text-foreground tabular-nums">
                  {formatCurrency(item.total)}
                </p>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <ShoppingBag className="mb-2 h-8 w-8" />
            <p className="font-mono text-[11px] uppercase tracking-widest">No items</p>
          </div>
        )}
      </div>

      {/* Coupon row */}
      <div className="border-t border-border px-5 py-3">
        {appliedCoupon ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-foreground" />
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground">
                {appliedCoupon.code}
              </span>
              {appliedCoupon.free_shipping && (
                <span className="font-mono text-[10px] text-muted-foreground">· Free shipping</span>
              )}
              {appliedCoupon.discount_value > 0 && (
                <span className="font-mono text-[10px] text-muted-foreground">
                  · −{formatCurrency(appliedCoupon.discount_value)}
                </span>
              )}
            </div>
            <button onClick={handleRemove} className="text-muted-foreground transition-colors hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Tag className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleApply()}
              placeholder="Coupon code"
              className="flex-1 bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              onClick={handleApply}
              disabled={validating || !couponInput.trim()}
              className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground underline underline-offset-4 transition-opacity hover:opacity-60 disabled:opacity-30"
            >
              {validating ? "…" : "Apply"}
            </button>
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="space-y-2.5 border-t border-border px-5 py-4">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-mono font-medium text-foreground tabular-nums">{formatCurrency(subtotal)}</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Discount</span>
            <span className="font-mono font-medium text-foreground tabular-nums">−{formatCurrency(couponDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-mono font-medium text-foreground tabular-nums">
            {shipping === 0 ? "FREE" : formatCurrency(shipping)}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between border-t-2 border-foreground px-5 py-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Total</span>
        <span className="font-mono text-xl font-bold text-foreground tabular-nums">{formatCurrency(total)}</span>
      </div>

      {/* Free shipping nudge */}
      {!freeShipping && subtotal < 500 && subtotal > 0 && (
        <div className="px-5 pb-4">
          <div className="border border-border bg-secondary px-3 py-2">
            <p className="font-mono text-[10px] leading-relaxed text-muted-foreground">
              Add{" "}
              <span className="font-semibold text-foreground">{formatCurrency(500 - subtotal)}</span>{" "}
              more for free shipping
            </p>
            <div className="mt-1.5 h-1 w-full bg-border">
              <div
                className="h-1 bg-foreground transition-all"
                style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
