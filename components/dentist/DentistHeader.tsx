'use client'

import { useEffect, useState } from 'react'
import { IconSearch, IconBell, IconSettings } from '@/components/shared/icons'
import { focusRing } from '@/lib/shared/focus-ring'
import { currentDentist } from '@/app/dentist/_mock/reference'

function formatNow(date: Date) {
  const day = date.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const time = date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
  return `${day} · ${time} น.`
}

export function DentistHeader() {
  const [searchTerm, setSearchTerm] = useState('')
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date())
    const timer = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(timer)
  }, [])

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
          className={`w-full bg-slate-50 border border-slate-200/60 rounded-full pl-10 pr-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-teal-400 transition-all ${focusRing}`}
        />
      </div>

      {/* Date, Notifications, Settings, Profile */}
      <div className="flex items-center gap-4">
        <p className="text-xs text-slate-400 hidden md:block font-medium">
          {now ? formatNow(now) : ''}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="การแจ้งเตือน"
            className="p-2 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition"
          >
            <IconBell className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="ตั้งค่า"
            className="p-2 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition"
          >
            <IconSettings className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 pl-2">
            <div className="w-9 h-9 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 text-sm font-bold shadow-sm">
              {initial}
            </div>
            <div className="hidden lg:block min-w-0">
              <p className="text-xs font-bold text-slate-800 leading-none truncate">{currentDentist.name}</p>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">{currentDentist.specialty}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
