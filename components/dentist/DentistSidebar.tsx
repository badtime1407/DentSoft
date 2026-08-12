'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { IconGrid, IconCalendar, IconClipboardList, IconLogout } from '@/components/shared/icons'
import { focusRing } from '@/lib/shared/focus-ring'

const navItems = [
  { href: '/dentist/dashboard', label: 'Dashboard', icon: IconGrid },
  { href: '/dentist/appointments', label: 'ตารางนัดหมาย', icon: IconCalendar },
  { href: '/dentist/treatment', label: 'บันทึกการรักษา', icon: IconClipboardList },
]

export function DentistSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 bg-white border-r border-slate-100 flex flex-col fixed top-0 left-0 h-full z-40">
      {/* DentSoft Brand Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
        <div className="relative w-9 h-9 shrink-0">
          <Image src="/DentSoftIcon.png" alt="DentSoft" fill className="object-contain" />
        </div>
        <div>
          <p className="font-extrabold text-slate-900 text-base leading-none">DentSoft</p>
          <p className="text-xs text-slate-400 mt-1 font-medium">Dentist Panel</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const ItemIcon = item.icon
          const active = pathname === item.href || pathname?.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all ${focusRing}
                ${active
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
            >
              <ItemIcon className={`w-4.5 h-4.5 shrink-0 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Menu Action (Logout only) */}
      <div className="p-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => {
            window.location.href = '/login'
          }}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-rose-600 hover:bg-rose-50 font-medium transition-all text-left ${focusRing}`}
        >
          <IconLogout className="w-4.5 h-4.5 text-rose-500" />
          ออกจากระบบ
        </button>
      </div>
    </aside>
  )
}
