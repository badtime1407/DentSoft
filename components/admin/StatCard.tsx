import type { ComponentType } from 'react'

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string
  value: string | number
  sub?: string
  icon: ComponentType<{ className?: string }>
}) {
  return (
    <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-blue-50 text-blue-600">
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold tabular-nums tracking-tight text-gray-900">{value}</p>
      <p className="text-xs mt-1 font-medium text-gray-500">{label}</p>
      {sub && <p className="text-xs mt-0.5 text-gray-400">{sub}</p>}
    </div>
  )
}
