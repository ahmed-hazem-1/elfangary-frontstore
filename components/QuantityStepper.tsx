"use client";

import { Minus, Plus } from "lucide-react";

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  labels,
  className = "",
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  labels?: { decrease?: string; increase?: string };
  className?: string;
}) {
  return (
    <div className={`flex items-center rounded-btn border border-ink-dark/15 bg-white h-11 shrink-0 select-none ${className}`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="h-full px-3.5 hover:bg-ink-dark/5 flex items-center justify-center transition-colors rounded-s-btn"
        aria-label={labels?.decrease || "decrease"}
      >
        <Minus className="h-4 w-4 text-ink-muted hover:text-ink-dark" />
      </button>
      <span className="min-w-10 text-center text-sm font-bold text-ink-dark">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="h-full px-3.5 hover:bg-ink-dark/5 flex items-center justify-center transition-colors rounded-e-btn"
        aria-label={labels?.increase || "increase"}
      >
        <Plus className="h-4 w-4 text-ink-muted hover:text-ink-dark" />
      </button>
    </div>
  );
}
