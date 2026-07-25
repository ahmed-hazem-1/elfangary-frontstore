"use client";

import { Minus, Plus } from "lucide-react";

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  labels,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  labels?: { decrease?: string; increase?: string };
}) {
  return (
    <div className="flex items-center rounded-btn border border-ink-dark/10 bg-white">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="px-3 py-2.5 hover:bg-ink-dark/5"
        aria-label={labels?.decrease || "decrease"}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-9 text-center text-sm font-semibold">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="px-3 py-2.5 hover:bg-ink-dark/5"
        aria-label={labels?.increase || "increase"}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
