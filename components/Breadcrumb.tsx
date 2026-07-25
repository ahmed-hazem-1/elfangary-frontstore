import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  name: string;
  href?: string;
}

export default function Breadcrumb({ items, locale }: { items: Crumb[]; locale: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-ink-muted">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {item.href ? (
            <Link href={item.href} className="hover:text-brand-orange">{item.name}</Link>
          ) : (
            <span className="font-medium text-ink-dark">{item.name}</span>
          )}
          {i < items.length - 1 && <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />}
        </span>
      ))}
    </nav>
  );
}
