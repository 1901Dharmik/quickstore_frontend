"use client";

import { useDeferredValue, useEffect, useMemo, useState, startTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-border bg-background px-3 py-2.5 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function ProductCard({ product }) {
  const addToCartMutation = useAddToCart();
  return (
    <article className="group flex h-full w-full flex-col border border-border bg-background transition-colors duration-300 hover:border-foreground">
      <div className="relative block overflow-hidden border-b border-border bg-secondary">
        <Link href={`/product/${product.slug || product.id}`} className="relative block">
          <div className="relative aspect-square overflow-hidden sm:aspect-[1.15/1]">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              sizes="(min-width: 1280px) 24vw, (min-width: 1024px) 32vw, 48vw"
              className="object-contain p-6 grayscale transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          </div>
        </Link>
      </div>
      <div className="flex flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex-1">
          <Link href={`/product/${product.slug || product.id}`}>
            <h4 className="mb-2 text-sm font-medium leading-snug text-foreground transition-opacity group-hover:opacity-70 sm:text-base">
              {product.title}
            </h4>
          </Link>
          <p className="font-mono text-xs font-medium text-foreground sm:text-sm">{formatCurrency(product.price)}</p>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-border pt-3">
          <button
            onClick={e => { e.preventDefault(); addToCartMutation.mutate({ product_id: product.id, quantity: 1 }); }}
            disabled={addToCartMutation.isPending}
            className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground underline underline-offset-4 transition-opacity hover:opacity-60 disabled:opacity-30 sm:text-[11px]"
          >
            {addToCartMutation.isPending ? 'Adding…' : 'Add to cart'}
          </button>
          <Link
            href={`/product/${product.slug || product.id}`}
            className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground underline underline-offset-4 transition-opacity hover:opacity-60 sm:text-[11px]"
          >
            Know more
          </Link>
        </div>
      </div>
    </article>
  );
}

function ShopSkeleton() {
  return (
    <main className="min-h-screen bg-background px-4 py-12 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-10">
        <div className="space-y-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-12 w-2/3 max-w-xl" />
        </div>
        <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="space-y-5">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
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
    <div className="space-y-5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={e => startTransition(() => setSearch(e.target.value))}
          placeholder="Search products…"
          className="w-full border border-border bg-background py-2.5 pl-9 pr-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
        />
      </div>
      <FilterSelect label="Category" value={category} onChange={v => startTransition(() => setCategory(v))} options={categoryOptions} />
      <FilterSelect label="Brand" value={brand} onChange={v => startTransition(() => setBrand(v))} options={brandOptions} />
      <FilterSelect label="Price" value={priceBand} onChange={v => startTransition(() => setPriceBand(v))} options={PRICE_FILTERS} />
      <FilterSelect label="Sort by" value={sortBy} onChange={v => startTransition(() => setSortBy(v))} options={SORT_OPTIONS} />
      {activeFilters.length > 0 && (
        <button onClick={clearAll} className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-background px-4 py-12 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Page header */}
        <div className="mb-10 border-b border-border pb-8">
          <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            QuickStore Curated
          </span>
          <div className="flex items-end justify-between gap-4">
            <h1 className="font-display text-4xl italic tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              The Catalogue
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => startTransition(() => refetch())}
                className="hidden items-center gap-1.5 border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground sm:flex"
              >
                <RefreshCw className="h-3 w-3" /> Sync
              </button>
              <button
                onClick={() => setSidebarOpen(o => !o)}
                className="flex items-center gap-1.5 border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground lg:hidden"
              >
                <SlidersHorizontal className="h-3 w-3" /> Filters
              </button>
            </div>
          </div>
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} found
          </p>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {activeFilters.map(f => (
              <button
                key={f.label}
                onClick={f.clear}
                className="flex items-center gap-1.5 border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground transition-colors hover:border-foreground"
              >
                {f.label} <X className="h-2.5 w-2.5" />
              </button>
            ))}
          </div>
        )}

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-foreground/40" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-72 overflow-y-auto border-r border-border bg-background p-6">
              <div className="mb-6 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-foreground">Filters</span>
                <button onClick={() => setSidebarOpen(false)}><X className="h-4 w-4" /></button>
              </div>
              {Filters}
            </div>
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* Desktop sidebar */}
          <aside className="hidden h-fit lg:sticky lg:top-24 lg:block">
            <div className="border-b border-border pb-4 mb-5">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-foreground">Filters</span>
            </div>
            {Filters}
          </aside>

          {/* Grid */}
          <div>
            {isError && (
              <div className="mb-8 border border-border p-6">
                <p className="text-sm text-foreground">Failed to load catalogue.</p>
                <button onClick={() => refetch()} className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground underline underline-offset-4">
                  Try again
                </button>
              </div>
            )}

            {loading && products.length > 0 && (
              <div className="mb-6 flex items-center gap-2 border border-border px-4 py-3">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-border border-t-foreground" />
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Refreshing…</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
              {visibleProducts.map(product => <ProductCard key={product.id} product={product} />)}
            </div>

            {!loading && visibleProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-4 border border-border py-20 text-center">
                <PackageSearch className="h-8 w-8 text-muted-foreground" />
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">No matches found</p>
                <button onClick={clearAll} className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground underline underline-offset-4">
                  Reset filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground transition-colors hover:border-foreground disabled:opacity-30"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors ${n === page ? 'border-foreground bg-foreground text-background' : 'border-border text-foreground hover:border-foreground'}`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground transition-colors hover:border-foreground disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
