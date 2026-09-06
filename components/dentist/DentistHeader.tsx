/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { IconLogout, IconSettings } from '@/components/shared/icons'
import { focusRing } from '@/lib/shared/focus-ring'

function formatNow(date: Date) {
  const day = date.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const time = date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
  return `${day} · ${time} น.`
}

export function DentistHeader() {
  const [now, setNow] = useState<Date | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session } = useSession()
  const dentistLabel = session?.user?.email ?? 'ทันตแพทย์'

  useEffect(() => {
    setNow(new Date())
    const timer = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetch('/api/dentist/me')
      .then((res) => res.json())
      .then((data: { avatarUrl?: string | null }) => setAvatarUrl(data.avatarUrl ?? null))
      .catch(() => setAvatarUrl(null))
  }, [])

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30 shrink-0">
      <p className="text-sm text-gray-500">{now ? formatNow(now) : ''}</p>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className={`flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition ${focusRing}`}
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-sm font-semibold overflow-hidden shrink-0">
              {avatarUrl ? <img src={avatarUrl} alt="โปรไฟล์" className="w-full h-full object-cover" /> : dentistLabel.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block min-w-0">
              <p className="text-sm font-medium text-gray-900 leading-none truncate">{dentistLabel}</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">ทันตแพทย์</p>
            </div>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-gray-100 shadow-lg z-50 overflow-hidden p-2">
                <Link
                  href="/dentist/profile"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition ${focusRing}`}
                >
                  <IconSettings className="w-4 h-4" />
                  แก้ไขโปรไฟล์
                </Link>
              </div>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/login' })}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-50 transition ${focusRing}`}
        >
          <IconLogout className="w-4 h-4" /> ออกจากระบบ
        </button>
      </div>
    </header>
  )
}
