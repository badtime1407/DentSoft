export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
}

export function SkeletonStatCard() {
  return (
    <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonTableRows({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-t border-gray-50">
          {Array.from({ length: columns }).map((_, c) => (
            <td key={c} className="px-6 py-4">
              <Skeleton className="h-4 w-full max-w-[120px]" />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

export function SkeletonListRows({ rows = 4, className = '' }: { rows?: number; className?: string }) {
  return (
    <ul className={`divide-y divide-gray-50 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="px-6 py-3.5 flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col justify-between gap-4">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-14 shrink-0" />
      </div>
      <Skeleton className="h-9 w-full rounded-xl" />
    </div>
  )
}

export function SkeletonDentistCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-3 w-1/2" />
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-6 rounded" />
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-16 rounded-full" />
        ))}
      </div>
    </div>
  )
}

export function SkeletonLines({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  )
}

export function SkeletonDetailPanel() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="w-[125px] h-20 rounded-2xl shrink-0" />
      <div className="flex-1 space-y-2.5">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  )
}
