import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/types/shopify";
import { localePath } from "@/lib/utils/urls";
import type { Locale } from "@/i18n/routing";

export default function CollectionCard({ collection, locale }: { collection: Collection; locale: Locale }) {
  const img = collection.image;
  return (
    <Link
      href={localePath(locale, "collections", collection.handle)}
      className="group card relative flex h-64 sm:h-72 lg:h-80 items-end overflow-hidden transition-all duration-400 ease-buttery hover:-translate-y-1.5"
    >
      {img ? (
        <Image
          src={img.url}
          alt={img.altText || collection.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-buttery group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange to-brand-amber" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-dark/80 via-ink-dark/20 to-transparent opacity-90 transition-opacity duration-400 group-hover:opacity-100" />
      <div className="relative z-10 p-6 sm:p-8 w-full">
        <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white group-hover:text-brand-orange transition-colors duration-300">{collection.title}</h3>
      </div>
    </Link>
  );
}
