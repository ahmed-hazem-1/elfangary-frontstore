import { Heart, ShieldCheck, Truck, Award, Sparkles } from "lucide-react";
import type { Metaobject } from "@/types/shopify";
import { metaobjectField } from "@/lib/queries/metaobjects";

const ICONS = ["heart", "shield", "truck", "award", "sparkles"];
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  heart: Heart,
  shield: ShieldCheck,
  truck: Truck,
  award: Award,
  sparkles: Sparkles,
};

export default function BenefitCard({ obj, index }: { obj: Metaobject; index: number }) {
  const title = metaobjectField(obj, "title");
  const description = metaobjectField(obj, "description");
  const iconKey = metaobjectField(obj, "icon") || ICONS[index % ICONS.length];
  const Icon = ICON_MAP[iconKey] || Sparkles;
  return (
    <div className="card flex flex-col items-start gap-2 sm:gap-3 p-4 sm:p-6 transition-all duration-250 ease-buttery hover:-translate-y-1">
      <div className="flex h-12 w-12 items-center justify-center rounded-btn bg-brand-orange/10 text-brand-orange">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-ink-dark">{title}</h3>
      <p className="text-sm leading-relaxed text-ink-muted">{description}</p>
    </div>
  );
}
