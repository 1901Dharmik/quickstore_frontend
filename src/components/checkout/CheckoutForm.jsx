"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Truck, Smartphone, ChevronRight } from "lucide-react";
import { usePlaceOrder } from "@/hooks/use-order";

function Field({ label, id, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </label>
      <input
        id={id}
        className="h-12 w-full border border-border bg-background px-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors"
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
              className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
                i === step ? "text-foreground"
                  : i < step ? "cursor-pointer text-muted-foreground hover:text-foreground"
                  : "cursor-default text-muted-foreground/40"
              }`}
            >
              <span className={`flex h-6 w-6 items-center justify-center border text-[10px] font-bold transition-colors ${
                i === step ? "border-foreground bg-foreground text-background"
                  : i < step ? "border-border bg-background text-muted-foreground"
                  : "border-border bg-background text-muted-foreground/40"
              }`}>
                {i < step ? "✓" : i + 1}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`mx-3 h-px w-8 ${i < step ? "bg-border" : "bg-border/40"}`} />
            )}
          </div>
        ))}
      </div>

      {/* ── Step 0 — Shipping ── */}
      {step === 0 && (
        <form onSubmit={handleShipping} className="space-y-5">
          <p className="mb-5 border-b border-border pb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
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

          <div className="flex items-center justify-between pt-2">
            <Link href="/cart" className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Cart
            </Link>
            <button type="submit" className="flex items-center gap-2 bg-foreground px-8 py-4 font-mono text-[10px] uppercase tracking-[0.15em] text-background transition-opacity hover:opacity-80">
              Continue <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      )}

      {/* ── Step 1 — Payment ── */}
      {step === 1 && (
        <div className="space-y-5">
          <p className="mb-5 border-b border-border pb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Payment Method
          </p>

          {/* COD — active/selected */}
          <div className="flex w-full items-center gap-4 border-2 border-foreground bg-foreground p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-background/10">
              <Truck className="h-5 w-5 text-background" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-background">Cash on Delivery</p>
              <p className="mt-0.5 text-xs text-background/60">Pay when your order arrives</p>
            </div>
            <div className="flex h-4 w-4 shrink-0 items-center justify-center border-2 border-background">
              <div className="h-2 w-2 bg-background" />
            </div>
          </div>

          {/* Online Payment — coming soon */}
          <div className="flex w-full items-center gap-4 border-2 border-border bg-background p-4 opacity-60 cursor-not-allowed">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-secondary">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">Online Payment</p>
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] border border-border px-1.5 py-0.5 text-muted-foreground">
                  Coming Soon
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">UPI · Cards · Net Banking</p>
            </div>
            <div className="flex h-4 w-4 shrink-0 items-center justify-center border-2 border-border" />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={() => setStep(0)} className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-2 bg-foreground px-8 py-4 font-mono text-[10px] uppercase tracking-[0.15em] text-background transition-opacity hover:opacity-80"
            >
              Review Order <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2 — Review ── */}
      {step === 2 && (
        <div className="space-y-5">
          <p className="mb-5 border-b border-border pb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Review & Confirm
          </p>

          {/* Shipping summary */}
          <div className="border border-border">
            <div className="flex items-center justify-between border-b border-border bg-secondary px-4 py-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Shipping To</span>
              <button onClick={() => setStep(0)} className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground">Edit</button>
            </div>
            <div className="space-y-0.5 px-4 py-3">
              <p className="text-sm font-medium text-foreground">{formData.first_name} {formData.last_name}</p>
              <p className="text-xs text-muted-foreground">{formData.address}, {formData.city}, {formData.state} — {formData.pincode}</p>
              <p className="text-xs text-muted-foreground">{formData.phone}{formData.email ? ` · ${formData.email}` : ""}</p>
            </div>
          </div>

          {/* Payment summary */}
          <div className="border border-border">
            <div className="flex items-center justify-between border-b border-border bg-secondary px-4 py-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Payment</span>
              <button onClick={() => setStep(1)} className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground">Edit</button>
            </div>
            <div className="px-4 py-3">
              <p className="text-sm font-medium text-foreground">Cash on Delivery</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Pay when your order arrives</p>
            </div>
          </div>

          {/* Coupon */}
          {coupon?.code && (
            <div className="border border-border">
              <div className="border-b border-border bg-secondary px-4 py-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Coupon Applied</span>
              </div>
              <div className="px-4 py-3">
                <p className="font-mono text-sm font-medium text-foreground">{coupon.code}</p>
                {coupon.discount > 0 && (
                  <p className="mt-0.5 text-xs text-muted-foreground">−₹{coupon.discount.toLocaleString("en-IN")} discount</p>
                )}
                {coupon.free_shipping && (
                  <p className="mt-0.5 text-xs text-muted-foreground">Free shipping applied</p>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="flex items-center gap-2 bg-foreground px-8 py-4 font-mono text-[10px] uppercase tracking-[0.15em] text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Lock className="h-3.5 w-3.5" />
              {isPending ? "Placing Order…" : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
