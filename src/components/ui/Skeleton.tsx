export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-black/[0.07] ${className}`} />
  );
}

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-line bg-white">
      <Skeleton className="h-30 rounded-none" />
      <div className="space-y-2 px-2.5 pb-3 pt-2.5">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}

/** Home feed placeholder: navy top bar, chips, Destacados row, grid. */
export function FeedSkeleton() {
  return (
    <>
      <div className="bg-brand-navy px-4 pb-4 pt-3">
        <Skeleton className="h-6 w-40 bg-white/20" />
        <Skeleton className="mt-3 h-10 w-full bg-white/20" />
      </div>
      <div className="flex gap-2 overflow-hidden px-3.5 py-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 shrink-0 rounded-full" />
        ))}
      </div>
      <div className="flex gap-3 overflow-hidden px-3.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="w-[170px] shrink-0">
            <CardSkeleton />
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 px-3.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}

/** Listing detail placeholder: big image, price, seller card. */
export function DetailSkeleton() {
  return (
    <div>
      <Skeleton className="h-64 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

/** Vertical list placeholder (messages, my listings). */
export function ListSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2 py-1">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
