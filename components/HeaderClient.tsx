"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import LocaleSwitcher from "./LocaleSwitcher";
import type { Locale } from "@/i18n/routing";

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
  const totalQuantity = useCartStore((s) => s.totalQuantity);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`${locale === "en" ? "/en" : ""}/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <header className="container-shell sticky top-0 z-40 mx-auto w-full border-b border-ink-dark/5 bg-white/95 backdrop-blur-xl px-4 py-3 sm:px-8 shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
        <Link href={locale === "en" ? "/en" : "/"} className="flex items-center gap-2 group">
          <span className="text-xl font-bold tracking-tight text-ink-dark group-hover:text-brand-orange transition-colors">
            {brand}
          </span>
          <span className="hidden text-xs font-semibold tracking-widest text-ink-muted sm:inline uppercase mt-1">
            {brandLatin}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="rounded-btn px-3 py-2 text-sm font-medium text-ink-dark transition-colors hover:bg-ink-dark/5 hover:text-brand-orange"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <form onSubmit={submitSearch} className="hidden md:flex items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={labels.searchPlaceholder}
                className="input-field h-10 w-40 ps-9 text-sm lg:w-56"
                aria-label={labels.search}
              />
            </div>
          </form>

          <Link
            href={`${locale === "en" ? "/en" : ""}/account`}
            className="btn-ghost h-10 w-10 p-0"
            aria-label={labels.account}
          >
            <User className="h-5 w-5" />
          </Link>

          <button
            onClick={openDrawer}
            className="btn-ghost relative h-10 w-10 p-0"
            aria-label={labels.cart}
          >
            <ShoppingBag className="h-5 w-5" />
            {mounted && totalQuantity > 0 && (
              <span className="absolute -end-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-orange px-1 text-[10px] font-bold text-white">
                {totalQuantity}
              </span>
            )}
          </button>

          <div className="hidden sm:block">
            <LocaleSwitcher />
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="btn-ghost h-10 w-10 p-0 lg:hidden"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="mt-3 flex flex-col gap-1 border-t border-ink-dark/5 pt-3 lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setMenuOpen(false)}
              className="rounded-btn px-3 py-2.5 text-sm font-medium hover:bg-ink-dark/5"
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
