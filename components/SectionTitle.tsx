export default function SectionTitle({ title, subtitle, id }: { title: string; subtitle?: string; id?: string }) {
  return (
    <div id={id} className="mb-8 text-center">
      <h2 className="text-2xl font-bold text-ink-dark sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-2 text-sm text-ink-muted sm:text-base">{subtitle}</p>}
    </div>
  );
}
