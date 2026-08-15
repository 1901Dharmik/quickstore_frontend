'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingBag, User2, Search, Menu, Tag, LayoutGrid, X } from 'lucide-react';
import { useUser, useLogout } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/api/product';
import { fetchCategories } from '@/api/category';
import { fetchBrands } from '@/api/brand';
import { useCart } from '@/hooks/use-cart';
import { RunningSeconds } from '@/components/ui/running-seconds';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/collections', label: 'Collections' },
  { href: '/about', label: 'About' },
];

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useUser();
  const { data: cart } = useCart();
  const [openSearch, setOpenSearch] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenSearch((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close the mobile drawer on route change
  useEffect(() => {
    setOpenMenu(false);
  }, [pathname]);

  const { data: searchRes, isFetching: isSearching, isError } = useQuery({
    queryKey: ['products', 'search', debouncedQuery],
    queryFn: () => fetchProducts({ q: debouncedQuery, limit: 5 }),
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
    staleTime: 1000 * 60 * 60,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => fetchBrands(),
    staleTime: 1000 * 60 * 60,
  });

  const searchResults = searchRes?.data || [];

  const filteredCategories = categories
    .filter((c) => (c.title || c.name || '').toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 4);

  const filteredBrands = brands
    .filter((b) => (b.name || '').toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 4);

  const displayName = user?.name || user?.email?.split('@')[0] || '';
  const displayEmail = user?.email || '';
  const cartCount = cart?.items?.length || 0;

  const handleSelectProduct = (productId) => {
    setOpenSearch(false);
    router.push(`/product/${productId}`);
  };

  const handleSelectCategory = (slug) => {
    setOpenSearch(false);
    router.push(`/shop?category=${slug}`);
  };

  const handleSelectBrand = (slug) => {
    setOpenSearch(false);
    router.push(`/shop?brand=${slug}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
        {/* Left: Mobile menu + Logo */}
        <div className="flex items-center gap-1">
          <Sheet open={openMenu} onOpenChange={setOpenMenu}>
            <SheetTrigger asChild>
              <button
                className="-ml-2 p-2 text-foreground md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-xs border-r border-border bg-background p-0 sm:max-w-sm">
              <div className="flex h-16 items-center justify-between border-b border-border px-5">
                <RunningSeconds size={18} label="QuickStore" className="text-foreground" />
                <SheetClose asChild>
                  <button className="p-2 text-foreground" aria-label="Close menu">
                    <X className="h-5 w-5" />
                  </button>
                </SheetClose>
              </div>
              <nav className="flex flex-col px-2 py-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="border-b border-border px-3 py-4 font-display text-2xl italic tracking-tight text-foreground transition-opacity last:border-b-0 hover:opacity-60"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3 border-t border-border p-5">
                {!isAuthenticated ? (
                  <>
                    <Link
                      href="/auth/login"
                      className="flex items-center justify-center border border-foreground py-3 font-mono text-xs uppercase tracking-[0.2em] text-foreground"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/auth/register"
                      className="flex items-center justify-center bg-foreground py-3 font-mono text-xs uppercase tracking-[0.2em] text-background"
                    >
                      Create account
                    </Link>
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Hi, {displayName}</span>
                    <button onClick={logout} className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-4">
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center pl-1 sm:pl-2">
            <RunningSeconds size={22} className="hidden text-foreground sm:inline-flex" />
            <span className="ml-0 font-display text-2xl italic tracking-tight text-foreground sm:ml-2.5 sm:text-[1.75rem]">
              QuickStore
            </span>
          </Link>
        </div>

        {/* Center: Desktop navigation */}
        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative py-2 font-mono text-xs uppercase tracking-[0.2em] transition-colors ${
                  active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-[1px] left-0 h-px bg-foreground transition-all duration-300 ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setOpenSearch(true)}
            className="p-2 text-foreground/80 transition-colors hover:text-foreground"
            aria-label="Search"
          >
            <Search className="h-[1.15rem] w-[1.15rem]" />
          </button>

          <CommandDialog open={openSearch} onOpenChange={setOpenSearch}>
            <CommandInput
              placeholder="Search products, brands, or categories..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>
                {isSearching ? 'Searching...' : isError ? 'Search failed. Please try again.' : 'No results found.'}
              </CommandEmpty>

              {filteredBrands.length > 0 && (
                <CommandGroup heading="Brands">
                  {filteredBrands.map((brand) => (
                    <CommandItem
                      key={brand._id || brand.slug}
                      value={`brand-${brand.name}`}
                      onSelect={() => handleSelectBrand(brand.slug)}
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 opacity-50" />
                        <span className="font-medium">{brand.name}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {filteredBrands.length > 0 && <CommandSeparator />}

              {filteredCategories.length > 0 && (
                <CommandGroup heading="Categories">
                  {filteredCategories.map((category) => (
                    <CommandItem
                      key={category._id || category.slug}
                      value={`category-${category.title || category.name}`}
                      onSelect={() => handleSelectCategory(category.slug)}
                    >
                      <div className="flex items-center gap-2">
                        <LayoutGrid className="h-4 w-4 opacity-50" />
                        <span className="font-medium">{category.title || category.name}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {(filteredBrands.length > 0 || filteredCategories.length > 0) && searchResults.length > 0 && (
                <CommandSeparator />
              )}

              {searchResults.length > 0 && (
                <CommandGroup heading="Products">
                  {searchResults.map((product) => {
                    const price = product.price || 0;
                    const formattedPrice = new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0,
                    }).format(price);

                    const thumbnail = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?q=80&w=800';

                    return (
                      <CommandItem
                        key={product._id || product.id}
                        value={product.title}
                        onSelect={() => handleSelectProduct(product.slug || product._id || product.id)}
                      >
                        <div className="flex items-center gap-3">
                          <img src={thumbnail} alt={product.title} className="h-8 w-8 grayscale object-cover" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{product.title}</span>
                            <span className="font-mono text-xs text-muted-foreground">{formattedPrice}</span>
                          </div>
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}

              {!searchQuery && searchResults.length === 0 && filteredBrands.length === 0 && filteredCategories.length === 0 && (
                <CommandGroup heading="Suggestions">
                  <CommandItem onSelect={() => setSearchQuery('Watch')}>Watches</CommandItem>
                  <CommandItem onSelect={() => setSearchQuery('Rolex')}>Rolex</CommandItem>
                  <CommandItem onSelect={() => setSearchQuery('Premium')}>Premium</CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </CommandDialog>

          <div className="hidden sm:flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex h-9 w-9 items-center justify-center text-foreground/80 transition-colors hover:text-foreground" aria-label="Account">
                  <User2 className="h-[1.15rem] w-[1.15rem]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 rounded-none p-0">
                {!isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 border-b border-border px-4 py-4">
                      <div className="flex h-10 w-10 items-center justify-center border border-border text-foreground/70">
                        <User2 className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate pb-0.5 text-sm text-foreground">Hi, Guest</p>
                      </div>
                    </div>
                    <DropdownMenuItem asChild className="rounded-none px-4 py-3">
                      <Link href="/auth/register">Create an account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-none px-4 py-3">
                      <Link href="/auth/login">Log in</Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 border-b border-border px-4 py-4">
                      <div className="flex h-10 w-10 items-center justify-center border border-border text-foreground/70">
                        <User2 className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate pb-0.5 text-sm text-foreground">Hi, {displayName}</p>
                        <p className="truncate text-xs text-muted-foreground">{displayEmail}</p>
                      </div>
                    </div>
                    <DropdownMenuItem asChild className="rounded-none px-4 py-2.5 text-sm">
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-none px-4 py-2.5 text-sm">
                      <Link href="/orders">My orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="rounded-none px-4 py-2.5 text-sm"
                      onSelect={(e) => {
                        e.preventDefault();
                        logout();
                      }}
                    >
                      Sign out
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Link href="/cart" className="relative p-2 text-foreground/80 transition-colors hover:text-foreground" aria-label="Cart">
            <ShoppingBag className="h-[1.15rem] w-[1.15rem]" />
            {cartCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-foreground font-mono text-[9px] font-semibold text-background">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
