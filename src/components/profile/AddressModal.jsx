import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useCreateAddress, useUpdateAddress } from '@/hooks/use-user-data';

export default function AddressModal({ isOpen, onClose, initialData = null }) {
  const { mutateAsync: createAddress, isPending: isCreating } = useCreateAddress();
  const { mutateAsync: updateAddress, isPending: isUpdating } = useUpdateAddress();
  const isPending = isCreating || isUpdating;

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        pincode: initialData.pincode || '',
        country: initialData.country || 'India',
      });
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData?._id) {
        await updateAddress({ id: initialData._id, data: formData });
      } else {
        await createAddress(formData);
      }
      onClose();
    } catch (error) {
      // Handled by react-query mutations
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="mb-6 flex items-center justify-between border-b border-[#e5e5e5] pb-4">
          <h2 className="text-xl font-semibold text-black">
            {initialData ? 'Edit Address' : 'Add New Address'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#737373] transition-colors hover:bg-[#f5f5f5] hover:text-black"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-black">First Name</label>
              <input
                type="text"
                name="first_name"
                required
                value={formData.first_name}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#e5e5e5] px-3 py-2 outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-black">Last Name</label>
              <input
                type="text"
                name="last_name"
                required
                value={formData.last_name}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#e5e5e5] px-3 py-2 outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-black">Phone Number</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#e5e5e5] px-3 py-2 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-black">Email (Optional)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#e5e5e5] px-3 py-2 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-black">Street Address</label>
            <textarea
              name="address"
              required
              rows={2}
              value={formData.address}
              onChange={handleChange}
              className="w-full resize-none rounded-lg border border-[#e5e5e5] px-3 py-2 outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-black">City</label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#e5e5e5] px-3 py-2 outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-black">PIN Code</label>
              <input
                type="text"
                name="pincode"
                required
                value={formData.pincode}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#e5e5e5] px-3 py-2 outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-black">State</label>
            <input
              type="text"
              name="state"
              required
              value={formData.state}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#e5e5e5] px-3 py-2 outline-none focus:border-black"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-3 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {initialData ? 'Save Changes' : 'Add Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
