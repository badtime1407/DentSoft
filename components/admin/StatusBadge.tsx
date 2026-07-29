export type StatusTone = 'emerald' | 'sky' | 'amber' | 'rose' | 'teal' | 'slate'

const toneConfig: Record<StatusTone, { dot: string; badge: string }> = {
  emerald: { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200' },
  sky: { dot: 'bg-sky-500', badge: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200' },
  amber: { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200' },
  rose: { dot: 'bg-rose-400', badge: 'bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-200' },
  teal: { dot: 'bg-teal-500', badge: 'bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-200' },
  slate: { dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200' },
}

export function StatusBadge({
  label,
  tone,
  dot = true,
}: {
  label: string
  tone: StatusTone
  dot?: boolean
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${toneConfig[tone].badge}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${toneConfig[tone].dot}`} />}
      {label}
    </span>
  )
}
