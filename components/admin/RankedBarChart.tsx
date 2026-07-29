import type { RankedItem } from '@/app/admin/reports/mock-reports'

export function RankedBarChart({
  items,
  color = '#059669',
  formatValue,
}: {
  items: RankedItem[]
  color?: string
  formatValue: (value: number) => string
}) {
  const max = Math.max(...items.map((i) => i.value), 1)

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-3">
          <span className="w-36 shrink-0 text-xs text-gray-600 truncate" title={item.label}>{item.label}</span>
          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${(item.value / max) * 100}%`, backgroundColor: color }} />
          </div>
          <span className="w-20 shrink-0 text-xs font-medium text-gray-700 text-right tabular-nums">{formatValue(item.value)}</span>
        </div>
      ))}
    </div>
  )
}
