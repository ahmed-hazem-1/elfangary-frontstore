import Image from "next/image";
import { Star } from "lucide-react";
import type { Metaobject } from "@/types/shopify";
import { metaobjectField, metaobjectImage } from "@/lib/queries/metaobjects";

export default function TestimonialCard({ obj }: { obj: Metaobject }) {
  const name = metaobjectField(obj, "name") || metaobjectField(obj, "author");
  const quote = metaobjectField(obj, "quote") || metaobjectField(obj, "content") || metaobjectField(obj, "review");
  const rating = Number(metaobjectField(obj, "rating") || "5");
  const avatar = metaobjectImage(obj, "avatar") || metaobjectImage(obj, "image");

  return (
    <div className="cream-card flex flex-col gap-4 p-6">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? "fill-brand-orange text-brand-orange" : "text-ink-muted/30"}`}
          />
        ))}
      </div>
      <p className="flex-1 text-sm leading-relaxed text-ink-dark">“{quote}”</p>
      <div className="flex items-center gap-3">
        {avatar?.url ? (
          <Image src={avatar.url} alt={avatar.altText || name} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange/15 font-bold text-brand-orange">
            {name.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-ink-dark">{name}</p>
        </div>
      </div>
    </div>
  );
}
