"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Globe } from "lucide-react";
import type { Locale } from "@/i18n/routing";

export default function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function switchTo(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "ar" || segments[0] === "en") {
      segments[0] = next;
    } else {
      segments.unshift(next);
    }
    router.push("/" + segments.join("/"));
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="btn-ghost h-10 px-3 gap-1.5 text-sm"
        aria-label="Change language"
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase">{locale}</span>
      </button>
      {open && (
        <div className="absolute end-0 mt-2 w-28 rounded-card border border-ink-dark/5 bg-white shadow-card p-1 z-50">
          {(["ar", "en"] as Locale[]).map((l) => (
            <button
              key={l}
              onClick={() => switchTo(l)}
              className={`w-full rounded-btn px-3 py-2 text-sm text-start hover:bg-ink-dark/5 ${
                l === locale ? "font-semibold text-brand-orange" : ""
              }`}
            >
              {l === "ar" ? "العربية" : "English"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
