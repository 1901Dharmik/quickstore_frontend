'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/use-auth';
import { useOrder } from '@/hooks/use-user-data';
import { ChevronLeft, Package, MapPin, Truck, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function SingleOrderPage({ params }) {
  const { id } = use(params);
  const { user, loading } = useUser();
  const router = useRouter();

  if (!loading && !user) {
    router.push('/auth/login');
    return null;
  }

  const { data: response, isLoading, isError } = useOrder(id);
  const order = response?.data;

  if (isLoading) {
    return (
      <div className="w-6xl mx-auto  px-4 py-10 md:px-6">
        <div className="flex h-64 items-center justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#e5e5e5] border-t-black" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="mx-auto w-6xl px-4 py-10 md:px-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fce8e6]">
          <AlertCircle className="h-8 w-8 text-[#c5221f]" />
        </div>
        <h2 className="text-xl font-semibold text-black">Order Not Found</h2>
        <p className="mt-2 text-[#737373]">We couldn't find the order you're looking for.</p>
        <Link href="/orders" className="mt-6 inline-flex rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <Link href="/orders" className="mb-6 inline-flex items-center gap-2 text-sm text-[#737373] hover:text-black">
        <ChevronLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-mono text-2xl font-semibold text-black">Order #{order.order_number}</h1>
          <p className="mt-1 text-sm text-[#737373]">
            Placed on {format(new Date(order.created_at), 'MMMM do, yyyy h:mm a')}
          </p>
        </div>
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${order.order_status === 'Delivered' ? 'bg-[#e6f4ea] text-[#137333]' :
            order.order_status === 'Cancelled' ? 'bg-[#fce8e6] text-[#c5221f]' :
              'bg-[#fef7e0] text-[#b06000]'
          }`}>
          {order.order_status}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Order Items */}
          <div className="rounded-xl border border-[#e5e5e5] bg-white overflow-hidden">
            <div className="border-b border-[#e5e5e5] bg-[#fafafa] px-6 py-4">
              <h2 className="font-medium text-black flex items-center gap-2">
                <Package className="h-5 w-5" />
                Items ({order.order_items?.length || 0})
              </h2>
            </div>
            <div className="divide-y divide-[#e5e5e5] p-6">
              {order.order_items?.map((item) => (
                <div key={item._id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-[#e5e5e5] bg-[#fafafa]">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#a3a3a3]">
                        <Package className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-black line-clamp-2">{item.name}</h3>
                        {item.variant_sku && (
                          <p className="mt-0.5 text-xs text-[#737373]">SKU: {item.variant_sku}</p>
                        )}
                        {item.selected_attributes && Object.entries(item.selected_attributes).map(([key, value]) => (
                          <span key={key} className="mt-1 mr-2 inline-block rounded bg-[#f5f5f5] px-2 py-0.5 text-[10px] uppercase text-[#737373]">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                      <p className="font-medium text-black">₹{item.price.toLocaleString()}</p>
                    </div>
                    <p className="text-sm text-[#737373]">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Summary */}
          <div className="rounded-xl border border-[#e5e5e5] bg-white overflow-hidden">
            <div className="border-b border-[#e5e5e5] bg-[#fafafa] px-6 py-4">
              <h2 className="font-medium text-black">Order Summary</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between text-sm text-[#737373]">
                <span>Subtotal</span>
                <span className="text-black">₹{order.items_total?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-[#737373]">
                <span>Shipping</span>
                <span className="text-black">₹{order.shipping_charge?.toLocaleString() || 0}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-[#137333]">
                  <span>Discount</span>
                  <span>-₹{order.discount?.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-[#e5e5e5] pt-4 mt-4 flex justify-between font-medium text-black">
                <span>Total</span>
                <span className="text-lg">₹{order.total_price?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="rounded-xl border border-[#e5e5e5] bg-white overflow-hidden">
            <div className="border-b border-[#e5e5e5] bg-[#fafafa] px-6 py-4">
              <h2 className="font-medium text-black flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Details
              </h2>
            </div>
            <div className="p-6">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-[#737373]" />
                <div className="text-sm">
                  <p className="font-medium text-black">{order.shipping_address?.full_name}</p>
                  <p className="mt-1 text-[#737373]">{order.shipping_address?.address_line_1}</p>
                  {order.shipping_address?.address_line_2 && <p className="text-[#737373]">{order.shipping_address?.address_line_2}</p>}
                  <p className="text-[#737373]">
                    {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zip_code}
                  </p>
                  <p className="text-[#737373]">{order.shipping_address?.country}</p>
                  <p className="mt-2 text-[#737373]">Phone: {order.shipping_address?.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
