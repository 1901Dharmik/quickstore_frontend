'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Menu, X, Tag, LayoutGrid, ShoppingCart, User } from 'lucide-react';
import { useUser, useLogout } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/api/product';
import { fetchCategories } from '@/api/category';
import { fetchBrands } from '@/api/brand';
import { useCart } from '@/hooks/use-cart';
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    <header className="sticky top-0 z-50 w-full border-b border-[#e5e5e5] bg-white">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        
        {/* Left: Mobile menu + Logo */}
        <div className="flex items-center gap-4">
          <Sheet open={openMenu} onOpenChange={setOpenMenu}>
            <SheetTrigger asChild>
              <button className="-ml-2 p-2 text-black md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" showCloseButton={false} className="w-[85vw] max-w-xs border-r border-[#e5e5e5] bg-white p-0 sm:max-w-sm">
              <div className="flex h-14 items-center justify-between border-b border-[#e5e5e5] px-5">
                <Link href="/" className="flex items-center gap-2">
                  <Image src="https://cdn.quickstore88.com/quickstore/quickstore_log1.png" alt="QuickStore Icon" width={24} height={24} className="object-contain" />
                  <Image src="https://cdn.quickstore88.com/quickstore/quickstore_log2.png" alt="QuickStore" width={90} height={24} className="object-contain" />
                </Link>
                <SheetClose asChild>
                  <button className="p-2 text-black" aria-label="Close menu">
                    <X className="h-5 w-5" />
                  </button>
                </SheetClose>
              </div>
              <nav className="flex flex-col p-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="py-3 font-sans text-[16px] font-medium text-black transition-colors hover:text-[#737373]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3 border-t border-[#e5e5e5] p-5">
                {!isAuthenticated ? (
                  <>
                    <Link
                      href="/auth/login"
                      className="flex h-9 items-center justify-center rounded-full border border-[#e5e5e5] bg-white px-5 font-sans text-[14px] font-medium text-black transition-colors hover:bg-[#fafafa]"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      className="flex h-9 items-center justify-center rounded-full bg-black px-5 font-sans text-[14px] font-medium text-white transition-colors hover:bg-[#090909]"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <button onClick={logout} className="font-sans text-[14px] font-medium text-[#737373] text-left">
                    Sign out
                  </button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <Image src="https://cdn.quickstore88.com/quickstore/quickstore_log1.png" alt="QuickStore Icon" width={28} height={28} className="object-contain" />
            <Image src="https://cdn.quickstore88.com/quickstore/quickstore_log2.png" alt="QuickStore" width={110} height={26} className="object-contain" />
          </Link>
        </div>

        {/* Center: Desktop navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-sans text-[14px] font-medium transition-colors ${
                pathname === link.href ? 'text-black' : 'text-[#737373] hover:text-black'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpenSearch(true)}
            className="hidden sm:flex h-9 items-center gap-2 rounded-full bg-[#fafafa] px-4 py-2 font-sans text-[14px] text-black transition-colors hover:bg-[#f5f5f5]"
          >
            <Search className="h-[14px] w-[14px] opacity-50" />
            <span className="opacity-70">Search</span>
          </button>

          <button
            onClick={() => setOpenSearch(true)}
            className="sm:hidden p-2 text-black transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Mobile Actions */}
          <div className="flex sm:hidden items-center gap-1 ml-1">
            {!isMounted ? (
              <div className="p-2 w-9 h-9" />
            ) : (
              <Link href={isAuthenticated ? "/profile" : "/auth/login"} className="p-2 text-black transition-colors hover:bg-[#f5f5f5] rounded-full">
                <User className="h-5 w-5" />
              </Link>
            )}
            <Link href="/cart" className="relative p-2 text-black transition-colors hover:bg-[#f5f5f5] rounded-full">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-[3px] font-mono text-[9px] font-bold text-white ring-2 ring-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-3 ml-2">
            {!isMounted ? (
              <div className="w-32 h-9" />
            ) : !isAuthenticated ? (
              <>
                <Link
                  href="/auth/register"

                  className="font-sans text-[14px] font-medium text-black transition-colors hover:text-[#737373]"
                >
                 Register
                </Link>
                <Link
                  href="/auth/login"
                  className="flex h-9 items-center justify-center rounded-full bg-black px-5 font-sans text-[14px] font-medium text-white transition-colors hover:bg-[#090909]"
                >
                   Login
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="font-sans text-[14px] font-medium text-black transition-colors hover:text-[#737373]">
                    Account
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-lg p-1 bg-white border-[#e5e5e5]">
                  <DropdownMenuItem asChild className="rounded-md px-3 py-2 text-[14px] cursor-pointer">
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-md px-3 py-2 text-[14px] cursor-pointer">
                    <Link href="/orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="rounded-md px-3 py-2 text-[14px] cursor-pointer text-[#ff5f56] focus:text-[#ff5f56]"
                    onSelect={(e) => {
                      e.preventDefault();
                      logout();
                    }}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            <Link
              href="/cart"
              className="flex h-9 items-center justify-center gap-2 rounded-full border border-[#d4d4d4] bg-white px-4 font-sans text-[14px] font-medium text-black transition-colors hover:bg-[#fafafa]"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingCart className="h-[14px] w-[14px]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-black px-[3px] font-mono text-[9px] font-bold text-white ring-1 ring-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className='ml-0.5'>Cart</span>
            </Link>
          </div>
        </div>

        <CommandDialog open={openSearch} onOpenChange={setOpenSearch}>
          {/* Keep CommandDialog implementation standard, it relies on shadcn styles */}
          <CommandInput
            placeholder="Search products..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {isSearching ? 'Searching...' : isError ? 'Search failed.' : 'No results found.'}
            </CommandEmpty>

            {filteredCategories.length > 0 && (
              <CommandGroup heading="Categories">
                {filteredCategories.map((category) => (
                  <CommandItem key={category.slug} value={`category-${category.title || category.name}`} onSelect={() => handleSelectCategory(category.slug)}>
                    <div className="flex items-center gap-3">
                      {category.image?.url ? (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#e5e5e5] bg-[#fafafa]">
                          <Image src={category.image.url} alt={category.title || category.name} width={32} height={32} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#e5e5e5] bg-[#fafafa]">
                          <LayoutGrid className="h-4 w-4 opacity-50" />
                        </div>
                      )}
                      <span className="font-medium">{category.title || category.name}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {filteredBrands.length > 0 && (
              <CommandGroup heading="Brands">
                {filteredBrands.map((brand) => (
                  <CommandItem key={brand.slug} value={`brand-${brand.name}`} onSelect={() => handleSelectBrand(brand.slug)}>
                    <div className="flex items-center gap-3">
                      {brand.image?.url ? (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#e5e5e5] bg-[#fafafa] p-1">
                          <Image src={brand.image.url} alt={brand.name} width={24} height={24} className="h-full w-full object-contain" />
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#e5e5e5] bg-[#fafafa]">
                          <Tag className="h-4 w-4 opacity-50" />
                        </div>
                      )}
                      <span className="font-medium">{brand.name}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            
            {searchResults.length > 0 && (
              <CommandGroup heading="Products">
                {searchResults.map((product) => (
                  <CommandItem
                    key={product.slug || product._id}
                    value={product.title}
                    onSelect={() => handleSelectProduct(product.slug || product._id)}
                  >
                    <div className="flex items-center gap-3">
                      {product.images?.[0]?.url ? (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#e5e5e5] bg-[#fafafa]">
                          <Image src={product.images[0].url} alt={product.title} width={40} height={40} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 shrink-0 rounded-md bg-[#f5f5f5]" />
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{product.title}</span>
                        {product.price && <span className="text-xs text-[#737373]">Rs. {product.price.toLocaleString('en-IN')}</span>}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </CommandDialog>
      </div>
    </header>
  );
};

export default Header;
