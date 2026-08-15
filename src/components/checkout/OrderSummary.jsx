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
  const baseShipping = 200; // Flat ₹200 for COD
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
    <div className="sticky top-28 rounded-[12px] border border-[#e5e5e5] bg-[#fafafa]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e5e5e5] px-6 py-5">
        <span className="font-sans text-[18px] font-medium text-black">Your Order</span>
        <span className="font-sans text-[14px] text-[#737373]">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Items */}
      <div className="max-h-72 divide-y divide-[#e5e5e5] overflow-y-auto">
        {cart?.items?.length ? (
          cart.items.map((item) => {
            const product = item.product || {};
            const title = item.variant ? `${product.title} — ${item.variant.title}` : product.title;
            const thumbnail = product.images?.[0]?.url || null;
            return (
              <div key={item._id} className="flex items-center gap-4 px-6 py-4">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[8px] bg-[#fafafa]">
                  {thumbnail ? (
                    <Image src={thumbnail} alt={title} fill className="object-contain p-2" sizes="64px" />
                  ) : (
                    <ShoppingBag className="h-6 w-6 text-[#a3a3a3]" />
                  )}
                  <span className="absolute -right-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-black font-sans text-[10px] font-bold text-white shadow-sm">
                    {item.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-sans text-[14px] font-medium leading-snug text-black">{title}</p>
                  <p className="mt-1 font-sans text-[12px] text-[#737373]">
                    {formatCurrency(item.price)} each
                  </p>
                </div>
                <p className="shrink-0 font-sans text-[14px] font-medium text-black tabular-nums">
                  {formatCurrency(item.total)}
                </p>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-[#737373]">
            <ShoppingBag className="mb-2 h-8 w-8" />
            <p className="font-sans text-[14px]">No items</p>
          </div>
        )}
      </div>

      {/* Coupon row */}
      <div className="border-t border-[#e5e5e5] px-6 py-4">
        {appliedCoupon ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#10b981]" />
              <span className="font-sans text-[14px] font-medium text-black">
                {appliedCoupon.code}
              </span>
              {appliedCoupon.free_shipping && (
                <span className="font-sans text-[12px] text-[#737373]">· Free shipping</span>
              )}
              {appliedCoupon.discount_value > 0 && (
                <span className="font-sans text-[12px] text-[#737373]">
                  · −{formatCurrency(appliedCoupon.discount_value)}
                </span>
              )}
            </div>
            <button onClick={handleRemove} className="text-[#737373] transition-colors hover:text-black">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-full border border-[#e5e5e5] bg-white px-4 py-1">
            <Tag className="h-4 w-4 shrink-0 text-[#a3a3a3]" />
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleApply()}
              placeholder="Coupon code"
              className="flex-1 bg-transparent py-2 font-sans text-[14px] text-black placeholder:text-[#a3a3a3] focus:outline-none"
            />
            <button
              onClick={handleApply}
              disabled={validating || !couponInput.trim()}
              className="font-sans text-[12px] font-medium text-black transition-opacity hover:opacity-60 disabled:opacity-30"
            >
              {validating ? "…" : "Apply"}
            </button>
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="space-y-3 border-t border-[#e5e5e5] px-6 py-5">
        <div className="flex justify-between font-sans text-[14px]">
          <span className="text-[#737373]">Subtotal</span>
          <span className="font-medium text-black tabular-nums">{formatCurrency(subtotal)}</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between font-sans text-[14px]">
            <span className="text-[#737373]">Discount</span>
            <span className="font-medium text-black tabular-nums">−{formatCurrency(couponDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between font-sans text-[14px]">
          <span className="text-[#737373]">Shipping</span>
          <span className="font-medium text-black tabular-nums">
            {shipping === 0 ? "Free" : formatCurrency(shipping)}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between border-t border-[#e5e5e5] px-6 py-5">
        <span className="font-sans text-[16px] font-medium text-black">Total</span>
        <span className="font-display text-[24px] font-medium text-black tabular-nums">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
