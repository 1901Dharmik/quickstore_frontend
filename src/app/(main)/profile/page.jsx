'use client';

import { useUser, useLogout } from '@/hooks/use-auth';
import { useOrders, useAddresses } from '@/hooks/use-user-data';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Mail, Shield, Calendar, LogOut, Package, MapPin, Phone, Plus, MoreVertical, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import AddressModal from '@/components/profile/AddressModal';
import { useDeleteAddress, useSetDefaultAddress } from '@/hooks/use-user-data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ProfilePage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const logoutMutation = useLogout();

  const { data: ordersRes, isLoading: isOrdersLoading } = useOrders();
  const { data: addressesRes, isLoading: isAddressesLoading } = useAddresses();
  const { mutateAsync: deleteAddress } = useDeleteAddress();
  const { mutateAsync: setDefaultAddress } = useSetDefaultAddress();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const orders = ordersRes?.data || [];
  const addresses = addressesRes?.data || [];

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#e5e5e5] border-t-black" />
      </div>
    );
  }

  const handleLogout = () => {
    logoutMutation.mutate();
    // Assuming useLogout hook handles routing or state clear, we can also force hard redirect
    window.location.href = '/';
  };

  const formattedDate = user.createdAt 
    ? format(new Date(user.createdAt), 'MMMM do, yyyy')
    : 'Unknown';

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : user.email.substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-12 md:py-20">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 font-sans text-3xl font-medium text-black tracking-tight">My Profile</h1>
        
        <div className="grid gap-8 md:grid-cols-3">
          
          {/* Main Profile Card */}
          <div className="md:col-span-2">
            <div className="rounded-2xl border border-[#eaeaea] bg-white p-8 shadow-sm">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
                {/* Avatar */}
                <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-black text-3xl font-medium text-white shadow-md">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    initials
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="font-sans text-2xl font-semibold text-black">{user.name || 'QuickStore User'}</h2>
                  <p className="mt-1 font-sans text-[15px] text-[#737373] flex items-center justify-center sm:justify-start gap-2">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </p>
                  
                  <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-4">
                    <div className="flex items-center gap-2 rounded-full bg-[#f5f5f5] px-4 py-2 text-sm text-[#404040]">
                      <Shield className="h-4 w-4" />
                      <span>{user.role?.name || 'User'}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-[#f5f5f5] px-4 py-2 text-sm text-[#404040]">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {formattedDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Saved Addresses */}
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-sans text-xl font-semibold text-black flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#737373]" />
                  Saved Addresses
                </h3>
                <button
                  onClick={() => {
                    setEditingAddress(null);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80"
                >
                  <Plus className="h-4 w-4" />
                  Add New
                </button>
              </div>

              {isAddressesLoading ? (
                <div className="flex h-32 items-center justify-center rounded-xl border border-[#eaeaea] bg-white">
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#e5e5e5] border-t-black" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-[#eaeaea] bg-[#fafafa]">
                  <p className="text-sm text-[#737373]">No saved addresses yet.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {addresses.map((address) => (
                    <div key={address._id} className={`relative rounded-xl border p-5 shadow-sm transition-shadow hover:shadow-md ${address.is_default ? 'border-black bg-[#fafafa]' : 'border-[#eaeaea] bg-white'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          {address.is_default && (
                            <span className="mb-2 inline-block rounded bg-black px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
                              Default
                            </span>
                          )}
                          <p className="font-medium text-black">{address.first_name} {address.last_name}</p>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger className="rounded-full p-1 text-[#737373] hover:bg-[#eaeaea] hover:text-black transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-lg bg-white p-1 border-[#e5e5e5]">
                            {!address.is_default && (
                              <DropdownMenuItem
                                onClick={() => setDefaultAddress(address._id)}
                                className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm"
                              >
                                <CheckCircle2 className="h-4 w-4" /> Set Default
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingAddress(address);
                                setIsModalOpen(true);
                              }}
                              className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm"
                            >
                              <Edit2 className="h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deleteAddress(address._id)}
                              className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <p className="mt-2 text-sm text-[#737373] leading-relaxed">
                        {address.address}<br />
                        {address.city}, {address.state} {address.pincode}<br />
                        {address.country}
                      </p>
                      <p className="mt-3 flex items-center gap-1 text-sm font-medium text-[#404040]">
                        <Phone className="h-3 w-3" />
                        {address.phone}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order History */}
            <div className="mt-8">
              <h3 className="mb-4 font-sans text-xl font-semibold text-black flex items-center gap-2">
                <Package className="h-5 w-5 text-[#737373]" />
                Order History
              </h3>
              {isOrdersLoading ? (
                <div className="flex h-32 items-center justify-center rounded-xl border border-[#eaeaea] bg-white">
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#e5e5e5] border-t-black" />
                </div>
              ) : orders.length === 0 ? (
                <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-[#eaeaea] bg-[#fafafa]">
                  <p className="text-sm text-[#737373]">You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {orders.map((order) => (
                    <div key={order._id} className="flex flex-col justify-between gap-4 rounded-xl border border-[#eaeaea] bg-white p-5 shadow-sm sm:flex-row sm:items-center">
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="font-mono text-sm font-medium text-black">{order.order_number}</p>
                          <span className={`rounded px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider ${
                            order.order_status === 'Delivered' ? 'bg-[#e6f4ea] text-[#137333]' :
                            order.order_status === 'Cancelled' ? 'bg-[#fce8e6] text-[#c5221f]' :
                            'bg-[#fef7e0] text-[#b06000]'
                          }`}>
                            {order.order_status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-[#737373]">
                          Placed on {format(new Date(order.created_at), 'MMM do, yyyy')}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-medium text-black">₹{order.total_price.toLocaleString()}</p>
                        <p className="mt-1 text-xs text-[#737373]">{order.order_items?.length || 0} items</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-[#eaeaea] bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-sans text-lg font-medium text-black">Account Actions</h3>
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#fff0f0] px-4 py-3 font-sans text-[15px] font-medium text-[#e11d48] transition-colors hover:bg-[#ffe4e6]"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingAddress}
      />
    </div>
  );
}
