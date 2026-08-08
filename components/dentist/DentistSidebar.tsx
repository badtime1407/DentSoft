'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconGrid, IconCalendar, IconClipboardList, IconTooth } from '@/components/shared/icons'
import { focusRing } from '@/lib/shared/focus-ring'

const navItems = [
  { href: '/dentist/dashboard', label: 'Dashboard', icon: IconGrid },
  { href: '/dentist/appointments', label: 'นัดหมายวันนี้', icon: IconCalendar },
  { href: '/dentist/treatment', label: 'บันทึกการรักษา', icon: IconClipboardList },
]

export function DentistSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 bg-white border-r border-gray-100 flex flex-col fixed top-0 left-0 h-full z-40">
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-teal-600 rounded-xl flex items-center justify-center text-white">
          <IconTooth className="w-4.5 h-4.5" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm leading-none">DentSoft</p>
          <p className="text-xs text-gray-400 mt-0.5">Dentist Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const ItemIcon = item.icon
          const active = pathname === item.href || pathname?.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${focusRing}
                ${active
                  ? 'bg-teal-600 text-white font-medium shadow-sm shadow-teal-200'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
            >
              <ItemIcon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-gray-400'}`} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
