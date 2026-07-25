"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { Search, Loader2 } from "lucide-react";

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
    const timer = setTimeout(() => {
      if (q !== (searchParams.get("q") || "")) update("q", q);
    }, 500);
    return () => clearTimeout(timer);
  }, [q, searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (minPrice !== (searchParams.get("minPrice") || "")) update("minPrice", minPrice);
      if (maxPrice !== (searchParams.get("maxPrice") || "")) update("maxPrice", maxPrice);
    }, 800);
    return () => clearTimeout(timer);
  }, [minPrice, maxPrice, searchParams]);

  return (
    <aside className={`card sticky top-24 h-fit w-full max-w-xs space-y-6 p-5 shrink-0 transition-opacity duration-300 ${isPending ? "opacity-60 pointer-events-none" : "opacity-100"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-ink-dark">{labels.filters}</h2>
          {isPending && <Loader2 className="h-4 w-4 animate-spin text-brand-orange" />}
        </div>
        {(params.toString() !== "") && (
          <button 
            onClick={() => startTransition(() => { router.push(pathname); })} 
            className="text-xs text-brand-orange hover:underline"
          >
            مسح الفلاتر
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
          <Search className="h-4 w-4 text-ink-muted" />
        </div>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={labels.search}
          className="block w-full rounded-shell border border-ink-dark/10 bg-ink-dark/5 p-2 ps-10 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
        />
      </div>

      {/* Sort */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink-dark">{labels.sortBy}</h3>
        <select
          value={params.get("sort") || "featured"}
          onChange={(e) => update("sort", e.target.value === "featured" ? "" : e.target.value)}
          className="block w-full rounded-shell border border-ink-dark/10 bg-white p-2 text-sm focus:border-brand-orange focus:outline-none"
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
          <h3 className="mb-2 text-sm font-semibold text-ink-dark">{labels.filterType}</h3>
          <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin">
            <button
              onClick={() => update("type", "")}
              className={`block w-full rounded-btn px-3 py-1.5 text-start text-sm ${
                !params.get("type") ? "bg-brand-orange/10 font-semibold text-brand-orange" : "hover:bg-ink-dark/5"
              }`}
            >
              {labels.all}
            </button>
            {types.map((t) => (
              <button
                key={t}
                onClick={() => update("type", t)}
                className={`block w-full rounded-btn px-3 py-1.5 text-start text-sm ${
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
        <h3 className="mb-2 text-sm font-semibold text-ink-dark">{labels.filterPrice}</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder={labels.minPrice}
            className="w-full rounded-btn border border-ink-dark/10 bg-white p-2 text-sm focus:border-brand-orange focus:outline-none"
          />
          <span className="text-ink-muted">-</span>
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder={labels.maxPrice}
            className="w-full rounded-btn border border-ink-dark/10 bg-white p-2 text-sm focus:border-brand-orange focus:outline-none"
          />
        </div>
      </div>

      {/* Toggles (Availability & Offers) */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm cursor-pointer group">
          <div className={`relative flex h-5 w-9 items-center rounded-full transition-colors ${params.get("available") === "true" ? "bg-brand-orange" : "bg-ink-dark/20"}`}>
            <div className={`h-3 w-3 rounded-full bg-white transition-transform ${params.get("available") === "true" ? "translate-x-1" : "translate-x-5"}`} />
          </div>
          <input
            type="checkbox"
            className="sr-only"
            checked={params.get("available") === "true"}
            onChange={(e) => update("available", e.target.checked ? "true" : "")}
          />
          <span className="group-hover:text-brand-orange transition-colors">{labels.inStock}</span>
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer group">
          <div className={`relative flex h-5 w-9 items-center rounded-full transition-colors ${params.get("offers") === "true" ? "bg-brand-orange" : "bg-ink-dark/20"}`}>
            <div className={`h-3 w-3 rounded-full bg-white transition-transform ${params.get("offers") === "true" ? "translate-x-1" : "translate-x-5"}`} />
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

    </aside>
  );
}
