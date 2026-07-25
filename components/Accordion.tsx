import { parseDescription } from "@/lib/utils/parseDescription";

export interface AccordionItem {
  question: string;
  answer: string;
}

export default function Accordion({ items }: { items: AccordionItem[] }) {
  if (!items.length) return null;
  return (
    <div className="mx-auto max-w-3xl divide-y divide-ink-dark/5 rounded-card border border-ink-dark/5 bg-white">
      {items.map((item, i) => (
        <details key={i} className="group px-5 py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-ink-dark">
            <span>{item.question}</span>
            <span className="text-brand-orange transition-transform duration-200 group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">{parseDescription(item.answer)}</p>
        </details>
      ))}
    </div>
  );
}
