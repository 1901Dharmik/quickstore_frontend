"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Truck, Smartphone, ChevronRight } from "lucide-react";
import { usePlaceOrder } from "@/hooks/use-order";

function Field({ label, id, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-sans text-[14px] text-black">
        {label}
      </label>
      <input
        id={id}
        className="h-12 w-full rounded-[12px] border border-[#e5e5e5] bg-white px-4 font-sans text-[14px] text-black placeholder:text-[#a3a3a3] focus:border-black focus:outline-none transition-colors"
        {...props}
      />
    </div>
  );
}

const STEPS = ["Shipping", "Payment", "Review"];

export default function CheckoutForm({ onSuccess, coupon }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const { mutateAsync: placeOrder, isPending } = usePlaceOrder();

  const handleShipping = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    setFormData(Object.fromEntries(fd.entries()));
    setStep(1);
  };

  const handleSubmit = async () => {
    try {
      const res = await placeOrder({
        shipping_address: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email || null,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        payment_method: "COD",
        payment_info: {},
        coupon_code: coupon?.code || null,
      });
      onSuccess({ orderNumber: res.data.order.order_number });
    } catch {
      // handled in hook
    }
  };

  return (
    <div>
      {/* Step indicator */}
      <div className="mb-10 flex items-center">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 font-sans text-[14px] font-medium transition-colors ${
                i === step ? "text-black"
                  : i < step ? "cursor-pointer text-[#737373] hover:text-black"
                  : "cursor-default text-[#a3a3a3]"
              }`}
            >
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[12px] transition-colors ${
                i === step ? "bg-black text-white"
                  : i < step ? "bg-[#e5e5e5] text-black"
                  : "bg-[#fafafa] text-[#a3a3a3]"
              }`}>
                {i < step ? "✓" : i + 1}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`mx-3 h-px w-8 ${i < step ? "bg-[#d4d4d4]" : "bg-[#f5f5f5]"}`} />
            )}
          </div>
        ))}
      </div>

      {/* ── Step 0 — Shipping ── */}
      {step === 0 && (
        <form onSubmit={handleShipping} className="space-y-6">
          <p className="mb-6 border-b border-[#e5e5e5] pb-4 font-sans text-[18px] font-medium text-black">
            Delivery Information
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" id="first_name" name="first_name" type="text" placeholder="Jane" defaultValue={formData.first_name} required />
            <Field label="Last Name" id="last_name" name="last_name" type="text" placeholder="Doe" defaultValue={formData.last_name} required />
          </div>
          <Field label="Email Address" id="email" name="email" type="email" placeholder="jane@example.com" defaultValue={formData.email} />
          <Field label="Phone Number" id="phone" name="phone" type="tel" placeholder="+91 98765 43210" defaultValue={formData.phone} required />
          <Field label="Street Address" id="address" name="address" type="text" placeholder="123 Main St, Apt 4B" defaultValue={formData.address} required />
          <div className="grid grid-cols-2 gap-4">
            <Field label="City" id="city" name="city" type="text" placeholder="Mumbai" defaultValue={formData.city} required />
            <Field label="PIN Code" id="pincode" name="pincode" type="text" placeholder="400001" defaultValue={formData.pincode} required maxLength="6" />
          </div>
          <Field label="State" id="state" name="state" type="text" placeholder="Maharashtra" defaultValue={formData.state} required />

          <div className="flex items-center justify-between pt-4">
            <Link href="/cart" className="flex items-center gap-2 font-sans text-[14px] text-[#737373] transition-colors hover:text-black">
              <ArrowLeft className="h-4 w-4" /> Back to Cart
            </Link>
            <button type="submit" className="flex h-12 items-center justify-center gap-2 rounded-full bg-black px-8 font-sans text-[14px] font-medium text-white transition-opacity hover:opacity-80">
              Continue <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}

      {/* ── Step 1 — Payment ── */}
      {step === 1 && (
        <div className="space-y-6">
          <p className="mb-6 border-b border-[#e5e5e5] pb-4 font-sans text-[18px] font-medium text-black">
            Payment Method
          </p>

          {/* COD — active/selected */}
          <div className="flex w-full items-center gap-4 rounded-[12px] border border-black p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#fafafa]">
              <Truck className="h-5 w-5 text-black" />
            </div>
            <div className="flex-1">
              <p className="font-sans text-[16px] font-medium text-black">Cash on Delivery</p>
              <p className="mt-1 font-sans text-[14px] text-[#737373]">Pay when your order arrives (₹200 flat rate)</p>
            </div>
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-black bg-black">
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          </div>

          {/* Online Payment — coming soon */}
          <div className="flex w-full items-center gap-4 rounded-[12px] border border-[#e5e5e5] bg-[#fafafa] p-4 opacity-60 cursor-not-allowed">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-white">
              <Smartphone className="h-5 w-5 text-[#a3a3a3]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-sans text-[16px] font-medium text-black">Online Payment</p>
                <span className="rounded-full bg-white px-2 py-0.5 font-sans text-[10px] text-[#737373] border border-[#e5e5e5]">
                  Coming Soon
                </span>
              </div>
              <p className="mt-1 font-sans text-[14px] text-[#737373]">UPI · Cards · Net Banking</p>
            </div>
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#e5e5e5] bg-white" />
          </div>

          <div className="flex items-center justify-between pt-4">
            <button type="button" onClick={() => setStep(0)} className="flex items-center gap-2 font-sans text-[14px] text-[#737373] transition-colors hover:text-black">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-black px-8 font-sans text-[14px] font-medium text-white transition-opacity hover:opacity-80"
            >
              Review Order <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2 — Review ── */}
      {step === 2 && (
        <div className="space-y-6">
          <p className="mb-6 border-b border-[#e5e5e5] pb-4 font-sans text-[18px] font-medium text-black">
            Review & Confirm
          </p>

          {/* Shipping summary */}
          <div className="rounded-[12px] border border-[#e5e5e5] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e5e5e5] bg-[#fafafa] px-4 py-3">
              <span className="font-sans text-[14px] font-medium text-[#737373]">Shipping To</span>
              <button onClick={() => setStep(0)} className="font-sans text-[14px] text-[#737373] transition-colors hover:text-black">Edit</button>
            </div>
            <div className="space-y-1 px-4 py-4">
              <p className="font-sans text-[16px] font-medium text-black">{formData.first_name} {formData.last_name}</p>
              <p className="font-sans text-[14px] text-[#737373]">{formData.address}, {formData.city}, {formData.state} — {formData.pincode}</p>
              <p className="font-sans text-[14px] text-[#737373]">{formData.phone}{formData.email ? ` · ${formData.email}` : ""}</p>
            </div>
          </div>

          {/* Payment summary */}
          <div className="rounded-[12px] border border-[#e5e5e5] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e5e5e5] bg-[#fafafa] px-4 py-3">
              <span className="font-sans text-[14px] font-medium text-[#737373]">Payment</span>
              <button onClick={() => setStep(1)} className="font-sans text-[14px] text-[#737373] transition-colors hover:text-black">Edit</button>
            </div>
            <div className="px-4 py-4">
              <p className="font-sans text-[16px] font-medium text-black">Cash on Delivery</p>
              <p className="mt-1 font-sans text-[14px] text-[#737373]">Pay when your order arrives</p>
            </div>
          </div>

          {/* Coupon */}
          {coupon?.code && (
            <div className="rounded-[12px] border border-[#e5e5e5] overflow-hidden">
              <div className="border-b border-[#e5e5e5] bg-[#fafafa] px-4 py-3">
                <span className="font-sans text-[14px] font-medium text-[#737373]">Coupon Applied</span>
              </div>
              <div className="px-4 py-4">
                <p className="font-sans text-[16px] font-medium text-black">{coupon.code}</p>
                {coupon.discount > 0 && (
                  <p className="mt-1 font-sans text-[14px] text-[#737373]">−₹{coupon.discount.toLocaleString("en-IN")} discount</p>
                )}
                {coupon.free_shipping && (
                  <p className="mt-1 font-sans text-[14px] text-[#737373]">Free shipping applied</p>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 font-sans text-[14px] text-[#737373] transition-colors hover:text-black">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-black px-8 font-sans text-[14px] font-medium text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Lock className="h-4 w-4" />
              {isPending ? "Placing Order…" : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
