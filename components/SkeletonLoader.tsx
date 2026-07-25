export default function SkeletonLoader({ className = "", count = 4 }: { className?: string; count?: number }) {
  return (
    <div className={`grid gap-5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card animate-pulse overflow-hidden" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="aspect-square bg-ink-dark/5" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-3/4 rounded bg-ink-dark/10" />
            <div className="h-3 w-1/2 rounded bg-ink-dark/5" />
            <div className="h-5 w-1/3 rounded bg-ink-dark/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
