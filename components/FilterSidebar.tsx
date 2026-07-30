"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { Search, Loader2, X, Filter } from "lucide-react";

export default function FilterSidebar({
  labels,
  types = [],
}: {
  labels: {
    filters: string;
    filterType: string;
    filterPrice: string;
    filterAvailability: string;
    inStock: string;
    all: string;
    apply: string;
    search: string;
    minPrice: string;
    maxPrice: string;
    offersOnly: string;
    sortBy: string;
    featured: string;
    priceLow: string;
    priceHigh: string;
    newest: string;
  };
  types?: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const [isPending, startTransition] = useTransition();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [q, setQ] = useState(params.get("q") || "");
  const [minPrice, setMinPrice] = useState(params.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") || "");

  function update(key: string, value: string) {
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  // Debounce text/number inputs
  useEffect(() => {
    const t = setTimeout(() => update("q", q), 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  useEffect(() => {
    const t = setTimeout(() => {
      update("minPrice", minPrice);
      update("maxPrice", maxPrice);
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPrice, maxPrice]);

  return (
    <>
      <div className="lg:hidden w-full mb-2">
        <button 
          onClick={() => setIsMobileOpen(true)} 
          className="btn-secondary w-full flex items-center justify-center gap-2 h-12 shadow-sm"
        >
          <Filter className="h-5 w-5" /> {labels.filters}
        </button>
      </div>

      <aside 
        className={`
          ${isMobileOpen ? "fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm sm:items-center sm:justify-center p-0 sm:p-4" : "hidden lg:block"}
          lg:sticky lg:top-24 h-fit w-full lg:max-w-xs shrink-0
        `}
      >
        <div 
          className={`
            ${isMobileOpen ? "w-full max-h-[70vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col gap-4 sm:gap-5" : "card space-y-4 sm:space-y-5 p-4 sm:p-5"}
            ${isPending ? "opacity-60 pointer-events-none" : "opacity-100"} transition-opacity duration-300
          `}
        >
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-ink-dark">{labels.filters}</h2>
              {isPending && <Loader2 className="h-4 w-4 animate-spin text-brand-orange" />}
            </div>
            <div className="flex items-center gap-3">
              {(params.toString() !== "") && (
                <button 
                  onClick={() => startTransition(() => { router.push(pathname); })} 
                  className="text-xs text-brand-orange hover:underline"
                >
                  مسح الفلاتر
                </button>
              )}
              {isMobileOpen && (
                <button onClick={() => setIsMobileOpen(false)} className="rounded-full bg-ink-dark/5 p-1.5 text-ink-muted hover:text-ink-dark lg:hidden">
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4 sm:space-y-5">
      {/* Search */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2.5">
          <Search className="h-3.5 w-3.5 text-ink-muted" />
        </div>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={labels.search}
          className="block w-full rounded-shell border border-ink-dark/10 bg-ink-dark/5 p-2 ps-8 text-xs focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
        />
      </div>

      {/* Sort */}
      <div>
        <h3 className="mb-2 text-xs sm:text-sm font-semibold text-ink-dark">{labels.sortBy}</h3>
        <select
          value={params.get("sort") || "featured"}
          onChange={(e) => update("sort", e.target.value === "featured" ? "" : e.target.value)}
          className="block w-full rounded-shell border border-ink-dark/10 bg-white p-2 text-xs focus:border-brand-orange focus:outline-none"
        >
          <option value="featured">{labels.featured}</option>
          <option value="price_low">{labels.priceLow}</option>
          <option value="price_high">{labels.priceHigh}</option>
          <option value="newest">{labels.newest}</option>
        </select>
      </div>

      {/* Type Filter */}
      {types.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs sm:text-sm font-semibold text-ink-dark">{labels.filterType}</h3>
          <div className="space-y-1 max-h-40 overflow-y-auto scrollbar-thin bg-ink-dark/5 p-2 rounded-xl border border-ink-dark/10">
            <button
              onClick={() => update("type", "")}
              className={`block w-full rounded-btn px-2.5 py-1.5 text-start text-xs ${
                !params.get("type") ? "bg-brand-orange/10 font-semibold text-brand-orange" : "hover:bg-ink-dark/5"
              }`}
            >
              {labels.all}
            </button>
            {types.map((t) => (
              <button
                key={t}
                onClick={() => update("type", t)}
                className={`block w-full rounded-btn px-2.5 py-1.5 text-start text-xs ${
                  params.get("type") === t ? "bg-brand-orange/10 font-semibold text-brand-orange" : "hover:bg-ink-dark/5"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="mb-2 text-xs sm:text-sm font-semibold text-ink-dark">{labels.filterPrice}</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder={labels.minPrice}
            className="w-full rounded-btn border border-ink-dark/10 bg-white p-2 text-xs focus:border-brand-orange focus:outline-none"
          />
          <span className="text-ink-muted text-xs">-</span>
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder={labels.maxPrice}
            className="w-full rounded-btn border border-ink-dark/10 bg-white p-2 text-xs focus:border-brand-orange focus:outline-none"
          />
        </div>
      </div>

      {/* Toggles (Availability & Offers) */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs cursor-pointer group">
          <div className={`relative flex h-4 w-7 items-center rounded-full transition-colors ${params.get("available") === "true" ? "bg-brand-orange" : "bg-ink-dark/20"}`}>
            <div className={`h-2.5 w-2.5 rounded-full bg-white transition-transform ${params.get("available") === "true" ? "translate-x-1" : "translate-x-4"}`} />
          </div>
          <input
            type="checkbox"
            className="sr-only"
            checked={params.get("available") === "true"}
            onChange={(e) => update("available", e.target.checked ? "true" : "")}
          />
          <span className="group-hover:text-brand-orange transition-colors">{labels.inStock}</span>
        </label>

        <label className="flex items-center gap-2 text-xs cursor-pointer group">
          <div className={`relative flex h-4 w-7 items-center rounded-full transition-colors ${params.get("offers") === "true" ? "bg-brand-orange" : "bg-ink-dark/20"}`}>
            <div className={`h-2.5 w-2.5 rounded-full bg-white transition-transform ${params.get("offers") === "true" ? "translate-x-1" : "translate-x-4"}`} />
          </div>
          <input
            type="checkbox"
            className="sr-only"
            checked={params.get("offers") === "true"}
            onChange={(e) => update("offers", e.target.checked ? "true" : "")}
          />
          <span className="group-hover:text-brand-orange transition-colors">{labels.offersOnly}</span>
        </label>
      </div>

      </div>

          {isMobileOpen && (
            <div className="mt-3 pt-3 border-t border-ink-dark/5 lg:hidden shrink-0 sticky bottom-0 bg-white pb-2 z-10">
              <button onClick={() => setIsMobileOpen(false)} className="btn-primary w-full h-10 text-sm shadow-premium">
                {labels.apply}
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
