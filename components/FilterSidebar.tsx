"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function FilterSidebar({
  labels,
  types = [],
  minPrice,
  maxPrice,
}: {
  labels: {
    filters: string;
    filterType: string;
    filterPrice: string;
    filterAvailability: string;
    inStock: string;
    all: string;
    apply: string;
  };
  types?: string[];
  minPrice?: number;
  maxPrice?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  function update(key: string, value: string) {
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <aside className="card sticky top-24 h-fit w-full max-w-xs space-y-6 p-5">
      <h2 className="text-lg font-bold text-ink-dark">{labels.filters}</h2>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink-dark">{labels.filterType}</h3>
        <div className="space-y-1.5">
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

      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink-dark">{labels.filterAvailability}</h3>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={params.get("available") === "true"}
            onChange={(e) => update("available", e.target.checked ? "true" : "")}
            className="h-4 w-4 rounded accent-brand-orange"
          />
          {labels.inStock}
        </label>
      </div>

      {minPrice !== undefined && maxPrice !== undefined && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-ink-dark">{labels.filterPrice}</h3>
          <p className="text-xs text-ink-muted">
            {minPrice} – {maxPrice}
          </p>
        </div>
      )}
    </aside>
  );
}
