'use client'

import { IconSearch } from './icons'
import { focusRing } from '@/lib/admin/focus-ring'

export function SearchBar({
  value,
  onChange,
  placeholder,
  className = 'w-full sm:w-64',
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  className?: string
}) {
  return (
    <div className={`relative ${className}`}>
      <IconSearch className="w-4 h-4 text-gray-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={`w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 focus:border-emerald-400 transition-all ${focusRing}`}
      />
    </div>
  )
}
