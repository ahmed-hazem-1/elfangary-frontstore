"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, Search, ShoppingBag, User, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import LocaleSwitcher from "./LocaleSwitcher";
import Logo from "./Logo";
import type { Locale } from "@/i18n/routing";
import { searchProductsAction } from "@/app/actions/search";
import type { Product } from "@/types/shopify";
import { localePath } from "@/lib/utils/urls";
import { formatPriceRange } from "@/lib/utils/formatCurrency";

interface NavItem {
  title: string;
  path: string;
}

export default function HeaderClient({
  locale,
  brand,
  brandLatin,
  nav,
  labels,
}: {
  locale: Locale;
  brand: string;
  brandLatin: string;
  nav: NavItem[];
  labels: { account: string; cart: string; search: string; searchPlaceholder: string };
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");
  const [mounted, setMounted] = useState(false);
  
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const totalQuantity = useCartStore((s) => s.totalQuantity);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!q.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    
    const timer = setTimeout(() => {
      startTransition(async () => {
        const results = await searchProductsAction(q.trim());
        setSearchResults(results);
        setShowDropdown(true);
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [q]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setShowDropdown(false);
    router.push(`${locale === "en" ? "/en" : ""}/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <header className="container-shell sticky top-0 z-40 mx-auto w-full border-b border-ink-dark/5 bg-white/95 backdrop-blur-xl px-3 py-2 sm:px-6 shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 sm:gap-4">
        <Link href={locale === "en" ? "/en" : "/"} className="flex items-center gap-2 group">
          <Logo className="h-7 w-7" />
          <span className="text-base sm:text-xl font-bold tracking-tight text-ink-dark group-hover:text-brand-orange transition-colors mt-1 font-arabic">
            {brand}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="rounded-btn px-2 py-1.5 text-sm font-medium text-ink-dark transition-colors hover:bg-ink-dark/5 hover:text-brand-orange"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <div className="relative hidden md:flex items-center" ref={dropdownRef}>
            <form onSubmit={submitSearch}>
              <div className="relative">
                <Search className="pointer-events-none absolute start-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
                <input
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    if (!showDropdown && e.target.value.trim()) setShowDropdown(true);
                  }}
                  onFocus={() => {
                    if (q.trim() && searchResults.length > 0) setShowDropdown(true);
                  }}
                  placeholder={labels.searchPlaceholder}
                  className="input-field h-8 w-32 ps-7 text-xs lg:w-48"
                  aria-label={labels.search}
                />
                {isPending && (
                  <Loader2 className="absolute end-2.5 top-1/2 h-3 w-3 -translate-y-1/2 animate-spin text-ink-muted" />
                )}
              </div>
            </form>
            
            {showDropdown && (q.trim().length > 0) && (
              <div className="absolute top-full mt-2 w-full min-w-[300px] end-0 rounded-xl bg-white shadow-xl border border-ink-dark/5 overflow-hidden z-50">
                {isPending && searchResults.length === 0 ? (
                  <div className="p-4 text-center text-sm text-ink-muted">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <ul className="max-h-[70vh] overflow-y-auto">
                    {searchResults.map(product => {
                      const price = formatPriceRange(
                        product.priceRange?.minVariantPrice,
                        product.priceRange?.maxVariantPrice,
                        locale
                      );
                      const img = product.featuredImage;
                      return (
                        <li key={product.id} className="border-b border-ink-dark/5 last:border-0 hover:bg-ink-dark/5 transition-colors">
                          <Link 
                            href={localePath(locale, "products", product.handle)}
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 p-3"
                          >
                            <div className="relative h-12 w-12 shrink-0 rounded-md bg-ink-dark/5 overflow-hidden">
                              {img ? (
                                <Image src={img.url} alt={img.altText || product.title} fill sizes="48px" className="object-cover" />
                              ) : (
                                <div className="h-full w-full bg-brand-gold"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-ink-dark truncate">{product.title}</h4>
                              <p className="text-xs text-brand-orange mt-0.5">{price}</p>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                    <li className="bg-ink-dark/5 p-2 text-center">
                      <Link 
                        href={`${locale === "en" ? "/en" : ""}/search?q=${encodeURIComponent(q.trim())}`}
                        onClick={() => setShowDropdown(false)}
                        className="block text-xs font-medium text-ink-dark hover:text-brand-orange transition-colors"
                      >
                        View all results
                      </Link>
                    </li>
                  </ul>
                ) : (
                  <div className="p-4 text-center text-sm text-ink-muted">No products found</div>
                )}
              </div>
            )}
          </div>

          <Link
            href={`${locale === "en" ? "/en" : ""}/account`}
            className="btn-ghost h-7 w-7 sm:h-8 sm:w-8 p-0"
            aria-label={labels.account}
          >
            <User className="h-4 w-4" />
          </Link>

          <button
            onClick={openDrawer}
            className="btn-ghost relative h-7 w-7 sm:h-8 sm:w-8 p-0"
            aria-label={labels.cart}
          >
            <ShoppingBag className="h-4 w-4" />
            {mounted && totalQuantity > 0 && (
              <span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-orange px-1 text-[9px] font-bold text-white">
                {totalQuantity}
              </span>
            )}
          </button>

          <div className="hidden sm:block">
            <LocaleSwitcher />
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="btn-ghost h-7 w-7 sm:h-8 sm:w-8 p-0 lg:hidden"
            aria-label="Menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="mt-2 flex flex-col gap-1 border-t border-ink-dark/5 pt-2 lg:hidden">
          <form onSubmit={(e) => { submitSearch(e); setMenuOpen(false); }} className="mb-2 flex items-center md:hidden">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute start-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={labels.searchPlaceholder}
                className="input-field h-8 w-full ps-7 text-xs"
                aria-label={labels.search}
              />
            </div>
          </form>
          {nav.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setMenuOpen(false)}
              className="rounded-btn px-2 py-2 text-sm font-medium hover:bg-ink-dark/5"
            >
              {item.title}
            </Link>
          ))}
          <div className="pt-2 sm:hidden">
            <LocaleSwitcher />
          </div>
        </nav>
      )}
    </header>
  );
}

