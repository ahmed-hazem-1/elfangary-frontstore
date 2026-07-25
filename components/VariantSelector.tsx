"use client";

import { useMemo } from "react";

export interface VariantOption {
  id: string;
  name: string;
  values: string[];
}

export interface Variant {
  id: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
}

export default function VariantSelector({
  options,
  variants,
  selected,
  onChange,
  labels,
}: {
  options: VariantOption[];
  variants: Variant[];
  selected: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
  labels: { selectVariant: string };
}) {
  const selectedVariant = useMemo(() => {
    return variants.find((v) =>
      v.selectedOptions.every((opt) => selected[opt.name] === opt.value)
    );
  }, [variants, selected]);

  function handleSelect(name: string, value: string) {
    onChange({ ...selected, [name]: value });
  }

  return (
    <div className="space-y-4">
      {options.map((opt) => (
        <div key={opt.id}>
          <p className="mb-2 text-sm font-semibold text-ink-dark">
            {opt.name}: <span className="text-ink-muted">{selected[opt.name] || labels.selectVariant}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {opt.values.map((value) => {
              const active = selected[opt.name] === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleSelect(opt.name, value)}
                  className={`rounded-btn border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "border-brand-orange bg-brand-orange text-white"
                      : "border-ink-dark/10 bg-white text-ink-dark hover:border-brand-orange"
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {selectedVariant && !selectedVariant.availableForSale && (
        <p className="text-sm font-medium text-red-500">{labels.selectVariant === "Select option" ? "Out of stock" : "غير متوفر"}</p>
      )}
    </div>
  );
}
