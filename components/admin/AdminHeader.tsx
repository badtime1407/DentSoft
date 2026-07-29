'use client'

import { useEffect, useState } from 'react'
import { IconLogout } from './icons'
import { focusRing } from '@/lib/admin/focus-ring'

function formatNow(date: Date) {
  const day = date.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const time = date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
  return `${day} · ${time} น.`
}

export function AdminHeader() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const timer = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30 shrink-0">
      <p className="text-sm text-gray-500">{now ? formatNow(now) : ''}</p>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-sm font-semibold">A</div>
          <div className="hidden sm:block min-w-0">
            <p className="text-sm font-medium text-gray-900 leading-none truncate">Admin</p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">ผู้ดูแลระบบ</p>
          </div>
        </div>
        <button
          type="button"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-50 transition ${focusRing}`}
        >
          <IconLogout className="w-4 h-4" /> ออกจากระบบ
        </button>
      </div>
    </header>
  )
}
