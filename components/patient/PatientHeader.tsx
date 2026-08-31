'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { IconLogout, IconSettings } from '@/components/shared/icons'
import { focusRing } from '@/lib/shared/focus-ring'

export function PatientHeader() {
  const [name, setName] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    fetch('/api/patient/me')
      .then((res) => res.json())
      .then((data: { firstName?: string; lastName?: string }) => {
        if (data.firstName) setName(`${data.firstName} ${data.lastName ?? ''}`.trim())
      })
  }, [])

  const initials = name ? name.charAt(0) : ''

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/patient/dashboard" className="flex items-center">
          <Image src="/LogoDentSoft.png" alt="DentSoft Clinic" width={350} height={138} className="h-10 w-auto" priority />
        </Link>

        {/* Right Section: Profile Avatar */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="โปรไฟล์"
            className={`w-9 h-9 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xs flex items-center justify-center shadow-sm hover:bg-blue-100 transition ${focusRing}`}
          >
            {initials}
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-100 shadow-lg z-50 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-sm flex items-center justify-center shadow-sm shrink-0">
                    {initials}
                  </div>
                  <p className="text-sm font-bold text-slate-800 truncate">{name || 'ผู้ใช้งาน'}</p>
                </div>

                <div className="p-2">
                  <Link
                    href="/patient/profile"
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition ${focusRing}`}
                  >
                    <IconSettings className="w-4 h-4" />
                    แก้ไขโปรไฟล์
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-rose-500 hover:bg-rose-50 transition ${focusRing}`}
                  >
                    <IconLogout className="w-4 h-4" />
                    ออกจากระบบ
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
