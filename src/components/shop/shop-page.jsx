"use client";

import { useDeferredValue, useEffect, useMemo, useState, startTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAddToCart } from '@/hooks/use-cart';
import { ArrowUpDown, PackageSearch, Search, X, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchProducts } from '@/api/product';
import { fetchCategories } from '@/api/category';
import { fetchBrands } from '@/api/brand';

const PAGE_SIZE = 12;

const PRICE_FILTERS = [
  { value: 'all', label: 'Any price' },
  { value: 'under-1000', label: 'Under ₹1,000' },
  { value: '1000-2500', label: '₹1,000 – ₹2,499' },
  { value: '2500-5000', label: '₹2,500 – ₹4,999' },
  { value: '5000-plus', label: '₹5,000+' },
];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'title-asc', label: 'Name: A → Z' },
];

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}

function matchesPriceBand(price, band) {
  switch (band) {
    case 'under-1000': return price < 1000;
    case '1000-2500': return price >= 1000 && price < 2500;
    case '2500-5000': return price >= 2500 && price < 5000;
    case '5000-plus': return price >= 5000;
    default: return true;
  }
}

function FilterSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="h-10 appearance-none rounded-full border-none bg-[#fafafa] px-4 py-2 pr-8 font-sans text-[14px] text-black cursor-pointer hover:bg-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[rgba(59,130,246,0.5)] transition-colors"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function ProductCard({ product }) {
  const addToCartMutation = useAddToCart();
  const router = useRouter();
  return (
    <article className="group flex h-full w-full flex-col rounded-[12px] border border-[#e5e5e5] bg-white transition-shadow duration-300 hover:shadow-sm">
      <div className="relative block overflow-hidden rounded-t-[12px] border-b border-[#e5e5e5] bg-white">
        <Link href={`/product/${product.slug || product.id}`} className="relative block">
          <div className="relative aspect-square overflow-hidden sm:aspect-[1.15/1]">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              sizes="(min-width: 1280px) 24vw, (min-width: 1024px) 32vw, 48vw"
              className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            />
          </div>
        </Link>
      </div>
      <div className="flex flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex-1">
          <Link href={`/product/${product.slug || product.id}`}>
            <h4 className="mb-1 font-sans text-[16px] font-medium leading-snug text-black transition-opacity hover:opacity-70">
              {product.title}
            </h4>
          </Link>
          <p className="font-sans text-[16px] text-[#737373]">{formatCurrency(product.price)}</p>
        </div>
        <div className="mt-4 flex flex-row gap-2 border-t border-[#e5e5e5] pt-4">
          <button
            onClick={e => { e.preventDefault(); addToCartMutation.mutate({ product_id: product.id, quantity: 1 }); }}
            disabled={addToCartMutation.isPending}
            className="flex h-9 flex-1 items-center justify-center rounded-full bg-black px-2 font-sans text-[13px] sm:text-[14px] font-medium text-white transition-colors hover:bg-[#090909] disabled:opacity-30"
          >
            {addToCartMutation.isPending ? 'Adding…' : 'Add to cart'}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              router.push(`/product/${product.slug || product.id}`);
            }}
            className="flex h-9 flex-1 items-center justify-center rounded-full border border-[#d4d4d4] bg-white px-2 font-sans text-[13px] sm:text-[14px] font-medium text-black transition-colors hover:bg-[#fafafa]"
          >
            Know more
          </button>
        </div>
      </div>
    </article>
  );
}

function ShopSkeleton() {
  return (
    <main className="min-h-screen bg-white px-4 py-20 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px] space-y-10">
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3 max-w-xl rounded-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-10 w-full max-w-4xl rounded-full" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4 rounded-[12px] border border-[#e5e5e5] p-4">
              <Skeleton className="aspect-square w-full rounded-[8px]" />
              <Skeleton className="h-5 w-3/4 rounded-full" />
              <Skeleton className="h-4 w-1/4 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [brand, setBrand] = useState(searchParams.get('brand') || 'all');
  const [priceBand, setPriceBand] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: fetchedCategories = [] } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const { data: fetchedBrands = [] } = useQuery({ queryKey: ['brands'], queryFn: fetchBrands });
  const { data: rawProductsRes, isFetching: loading, isError, refetch } = useQuery({
    queryKey: ['products', 'shop'],
    queryFn: () => fetchProducts({ limit: 500 }),
    staleTime: 1000 * 60 * 5,
  });

  const products = useMemo(() => {
    return (rawProductsRes?.data || []).map(p => ({
      id: p._id || p.id,
      slug: p.slug || p._id,
      title: p.title || 'Product',
      price: p.price || 0,
      thumbnail: p.images?.[0]?.url || 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?q=80&w=800',
      category: p.categories?.[0]?.slug || 'uncategorized',
      brandSlug: p.brand?.slug || 'generic',
    }));
  }, [rawProductsRes]);

  useEffect(() => {
    const urlCat = searchParams.get('category');
    const urlBrand = searchParams.get('brand');
    if (urlCat) setCategory(urlCat);
    if (urlBrand) setBrand(urlBrand);
  }, [searchParams]);

  const categoryOptions = useMemo(() => [
    { value: 'all', label: 'All categories' },
    ...fetchedCategories.map(c => ({ value: c.slug, label: c.title || c.name || c.slug })),
  ], [fetchedCategories]);

  const brandOptions = useMemo(() => [
    { value: 'all', label: 'All brands' },
    ...fetchedBrands.map(b => ({ value: b.slug, label: b.name || b.slug })),
  ], [fetchedBrands]);

  const filteredProducts = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    const filtered = products.filter(p => {
      const matchSearch = !q || p.title.toLowerCase().includes(q);
      const matchCat = category === 'all' || p.category === category;
      const matchBrand = brand === 'all' || p.brandSlug === brand;
      const matchPrice = matchesPriceBand(p.price, priceBand);
      return matchSearch && matchCat && matchBrand && matchPrice;
    });
    const sorted = [...filtered];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (sortBy === 'title-asc') sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [products, deferredSearch, category, brand, priceBand, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const visibleProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => { setPage(1); }, [deferredSearch, category, brand, priceBand, sortBy]);

  const activeFilters = [
    category !== 'all' && { label: categoryOptions.find(c => c.value === category)?.label || category, clear: () => setCategory('all') },
    brand !== 'all' && { label: brandOptions.find(b => b.value === brand)?.label || brand, clear: () => setBrand('all') },
    priceBand !== 'all' && { label: PRICE_FILTERS.find(p => p.value === priceBand)?.label || priceBand, clear: () => setPriceBand('all') },
    search && { label: `"${search}"`, clear: () => setSearch('') },
  ].filter(Boolean);

  const clearAll = () => startTransition(() => { setSearch(''); setCategory('all'); setBrand('all'); setPriceBand('all'); setSortBy('featured'); setPage(1); });

  if (loading && products.length === 0 && !isError) return <ShopSkeleton />;

  const Filters = (
    <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-center">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#737373]" />
        <input
          value={search}
          onChange={e => startTransition(() => setSearch(e.target.value))}
          placeholder="Search..."
          className="h-10 w-full lg:w-64 rounded-full border-none bg-[#fafafa] py-2 pl-11 pr-4 font-sans text-[14px] text-black placeholder:text-[#737373] hover:bg-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[rgba(59,130,246,0.5)] transition-colors"
        />
      </div>
      <FilterSelect value={category} onChange={v => startTransition(() => setCategory(v))} options={categoryOptions} />
      <FilterSelect value={brand} onChange={v => startTransition(() => setBrand(v))} options={brandOptions} />
      <FilterSelect value={priceBand} onChange={v => startTransition(() => setPriceBand(v))} options={PRICE_FILTERS} />
      <FilterSelect value={sortBy} onChange={v => startTransition(() => setSortBy(v))} options={SORT_OPTIONS} />
      {activeFilters.length > 0 && (
        <button onClick={clearAll} className="h-10 rounded-full px-4 font-sans text-[14px] font-medium text-[#737373] hover:text-black transition-colors self-start lg:self-auto">
          Clear all
        </button>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-white px-4 py-20 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        {/* Page header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="font-display text-[36px] font-medium text-black">
              Shop
            </h1>
            <p className="mt-2 font-sans text-[16px] text-[#737373]">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} found
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="flex h-10 items-center gap-2 rounded-full border border-[#d4d4d4] bg-white px-4 font-sans text-[14px] font-medium text-black transition-colors hover:bg-[#fafafa] lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <button
              onClick={() => startTransition(() => refetch())}
              className="flex h-10 items-center gap-2 rounded-full border border-[#d4d4d4] bg-white px-4 font-sans text-[14px] font-medium text-black transition-colors hover:bg-[#fafafa]"
              title="Sync products"
            >
              <RefreshCw className="h-4 w-4" /> Sync
            </button>
          </div>
        </div>

        {/* Horizontal Filters Bar (Desktop) */}
        <div className="hidden lg:block sticky top-14 z-30 mb-8 border-b border-[#e5e5e5] bg-white py-4">
          {Filters}
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {activeFilters.map(f => (
              <button
                key={f.label}
                onClick={f.clear}
                className="flex h-7 items-center gap-1.5 rounded-full bg-[#fafafa] px-3 font-sans text-[12px] text-black transition-colors hover:bg-[#e5e5e5]"
              >
                {f.label} <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-80 overflow-y-auto bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between border-b border-[#e5e5e5] pb-4">
                <span className="font-sans text-[16px] font-medium text-black">Filters</span>
                <button onClick={() => setSidebarOpen(false)} className="rounded-full p-2 hover:bg-[#fafafa]">
                  <X className="h-5 w-5 text-black" />
                </button>
              </div>
              {Filters}
            </div>
          </div>
        )}

        {/* Grid (No sidebar) */}
        <div>
          {isError && (
            <div className="mb-8 rounded-[12px] border border-[#e5e5e5] p-6 text-center">
              <p className="font-sans text-[16px] text-[#737373]">Failed to load catalogue.</p>
              <button onClick={() => refetch()} className="mt-4 rounded-full border border-[#d4d4d4] bg-white px-5 py-2 font-sans text-[14px] font-medium text-black transition-colors hover:bg-[#fafafa]">
                Try again
              </button>
            </div>
          )}

          {loading && products.length > 0 && (
            <div className="mb-6 flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-[#fafafa] px-4 py-2 w-fit">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#d4d4d4] border-t-black" />
              <p className="font-sans text-[14px] text-[#737373]">Refreshing…</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {visibleProducts.map(product => <ProductCard key={product.id} product={product} />)}
          </div>

          {!loading && visibleProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 rounded-[12px] border border-[#e5e5e5] py-20 text-center bg-[#fafafa]">
              <PackageSearch className="h-10 w-10 text-[#a3a3a3]" />
              <p className="font-sans text-[16px] text-[#737373]">No matches found.</p>
              <button onClick={clearAll} className="mt-2 rounded-full bg-black px-5 py-2 font-sans text-[14px] font-medium text-white transition-colors hover:bg-[#090909]">
                Reset filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="flex h-9 items-center justify-center rounded-full border border-[#d4d4d4] bg-white px-4 font-sans text-[14px] font-medium text-black transition-colors hover:bg-[#fafafa] disabled:opacity-30 disabled:hover:bg-white"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => handlePageChange(n)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full font-sans text-[14px] font-medium transition-colors ${n === page ? 'bg-black text-white' : 'border border-[#d4d4d4] bg-white text-black hover:bg-[#fafafa]'}`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="flex h-9 items-center justify-center rounded-full border border-[#d4d4d4] bg-white px-4 font-sans text-[14px] font-medium text-black transition-colors hover:bg-[#fafafa] disabled:opacity-30 disabled:hover:bg-white"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
