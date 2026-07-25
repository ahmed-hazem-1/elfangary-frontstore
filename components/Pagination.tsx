import Link from "next/link";

export default function Pagination({ nextCursor, loadMoreLabel }: { nextCursor: string | null; loadMoreLabel: string }) {
  if (!nextCursor) return null;
  return (
    <div className="mt-10 flex justify-center">
      <Link
        href={`?cursor=${nextCursor}`}
        className="btn-secondary"
        scroll={false}
      >
        {loadMoreLabel}
      </Link>
    </div>
  );
}
