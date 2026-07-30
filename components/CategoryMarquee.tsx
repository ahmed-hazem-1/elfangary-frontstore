"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { localePath } from "@/lib/utils/urls";
import type { Locale } from "@/i18n/routing";

export default function CategoryMarquee() {
  const locale = useLocale() as Locale;
  const items = locale === "ar" ? [
    "عسل سدر", "عسل سمرة", "عسل زهور", "عسل مجرى", "عسل طلح", "عسل كستناء", "عسل الغابة السوداء", "شمع العسل",
  ] : [
    "Sidr Honey", "Samra Honey", "Floral Honey", "White Honey", "Talh Honey", "Chestnut Honey", "Black Forest Honey", "Honeycomb",
  ];

  return (
    <div className="bg-brand-orange text-white py-3 overflow-x-auto flex whitespace-nowrap group" style={{ scrollbarWidth: 'none' }}>
      <div className="sm:animate-marquee hover:[animation-play-state:paused] group-hover:[animation-play-state:paused] flex gap-6 sm:gap-10 px-4 items-center w-max hover:cursor-pointer">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <Link key={i} href={localePath(locale, "shop") + `?q=${item}`} className="flex items-center gap-6 sm:gap-10 text-sm sm:text-base font-semibold tracking-wide hover:text-ink-dark transition-colors">
            {item} <span className="opacity-40 text-[10px]">♦</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
