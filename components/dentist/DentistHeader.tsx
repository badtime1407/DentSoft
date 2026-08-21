'use client'

import { useState } from 'react'
import { IconSearch } from '@/components/shared/icons'
import { focusRing } from '@/lib/shared/focus-ring'
import { currentDentist } from '@/app/dentist/_mock/reference'

export function DentistHeader() {
  const [searchTerm, setSearchTerm] = useState('')
  const initial = currentDentist.name.replace(/^ทพญ\.|^ทพ\./, '').trim().charAt(0)

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-30 shrink-0 gap-6">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <IconSearch className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ค้นหารายชื่อคนไข้..."
          className={`w-full bg-slate-50 border border-slate-200/60 rounded-full pl-10 pr-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-400 transition-all ${focusRing}`}
        />
      </div>

      {/* Profile */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 text-sm font-bold shadow-sm">
          {initial}
        </div>
        <div className="hidden sm:block min-w-0">
          <p className="text-xs font-bold text-slate-800 leading-none truncate">{currentDentist.name}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">{currentDentist.specialty}</p>
        </div>
      </div>
    </header>
  )
}
