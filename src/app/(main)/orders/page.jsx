'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/use-auth';
import { useOrders } from '@/hooks/use-user-data';
import { Package, Search, Filter, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('');

  // Handle Search Debounce
  useState(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Auth Guard
  if (!loading && !user) {
    router.push('/auth/login');
    return null;
  }

  const { data: response, isLoading } = useOrders({
    page,
    limit: 10,
    search: debouncedSearch,
    status
  });

  const orders = response?.data || [];
  const pagination = response?.pagination || { totalPages: 1 };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-sans text-2xl font-semibold text-black">My Orders</h1>
          <p className="mt-1 text-sm text-[#737373]">View and track all your recent orders.</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#737373]" />
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-[#e5e5e5] bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition-colors focus:border-black"
          />
        </div>
        
        <div className="relative w-full sm:w-48">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#737373]" />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-full appearance-none rounded-lg border border-[#e5e5e5] bg-white py-2.5 pl-9 pr-8 text-sm outline-none transition-colors focus:border-black"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Ordered">Ordered</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="rounded-xl border border-[#e5e5e5] bg-white overflow-hidden">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#e5e5e5] border-t-black" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-center p-6">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f5f5]">
              <Package className="h-8 w-8 text-[#737373]" />
            </div>
            <h3 className="font-medium text-black text-lg">No orders found</h3>
            <p className="mt-1 text-sm text-[#737373]">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#e5e5e5]">
            {orders.map((order) => (
              <div key={order._id} className="p-6 transition-colors hover:bg-[#fafafa]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  <div className="flex items-start gap-4">
                    <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f5f5] shrink-0">
                      <Package className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-medium text-black">#{order.order_number}</span>
                        <span className={`rounded px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider ${
                          order.order_status === 'Delivered' ? 'bg-[#e6f4ea] text-[#137333]' :
                          order.order_status === 'Cancelled' ? 'bg-[#fce8e6] text-[#c5221f]' :
                          'bg-[#fef7e0] text-[#b06000]'
                        }`}>
                          {order.order_status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[#737373]">
                        {format(new Date(order.created_at), 'MMMM do, yyyy')} • {order.order_items?.length || 0} items
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3">
                    <div className="text-left sm:text-right">
                      <p className="font-medium text-black">₹{order.total_price.toLocaleString()}</p>
                      <p className="text-xs text-[#737373]">Total</p>
                    </div>
                    <Link
                      href={`/orders/${order._id}`}
                      className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#090909]"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Link>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e5e5e5] bg-white text-black transition-colors hover:bg-[#f5f5f5] disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex h-10 items-center justify-center rounded-lg border border-[#e5e5e5] bg-white px-4 text-sm font-medium">
            Page {page} of {pagination.totalPages}
          </div>

          <button
            disabled={page === pagination.totalPages}
            onClick={() => setPage(p => p + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e5e5e5] bg-white text-black transition-colors hover:bg-[#f5f5f5] disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
