import { Star, ShieldCheck, Truck, FlaskConical, Leaf } from "lucide-react";

export interface TrustBadge {
  icon: string;
  label: string;
}

export default function TrustStrip({ badges }: { badges: TrustBadge[] }) {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    natural: Leaf,
    noAdditives: ShieldCheck,
    premium: Star,
    fastDelivery: Truck,
    labTested: FlaskConical,
  };
  return (
    <div className="section -mt-8 relative z-20">
      <div className="container-shell flex flex-wrap items-center justify-center gap-2.5 px-4 py-4 sm:gap-4">
        {badges.map((b) => {
          const Icon = icons[b.icon] || Star;
          return (
            <div key={b.icon} className="pill gap-2 px-4 py-2 text-sm">
              <Icon className="h-4 w-4 text-brand-orange" />
              <span className="font-medium">{b.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
