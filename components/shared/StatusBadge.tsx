export type StatusTone = 'blue' | 'sky' | 'amber' | 'rose' | 'cyan' | 'slate'

const toneConfig: Record<StatusTone, { dot: string; badge: string }> = {
  blue: { dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200' },
  sky: { dot: 'bg-sky-500', badge: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200' },
  amber: { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200' },
  rose: { dot: 'bg-rose-400', badge: 'bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-200' },
  cyan: { dot: 'bg-cyan-500', badge: 'bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200' },
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
