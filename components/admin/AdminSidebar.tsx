'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconGrid, IconCalendar, IconUsers, IconBadge, IconChartBar } from './icons'
import { focusRing } from '@/lib/admin/focus-ring'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: IconGrid },
  { href: '/admin/appointments', label: 'นัดหมาย', icon: IconCalendar },
  { href: '/admin/patients', label: 'คนไข้', icon: IconUsers },
  { href: '/admin/dentists', label: 'ทันตแพทย์', icon: IconBadge },
  { href: '/admin/reports', label: 'รายงาน', icon: IconChartBar },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 bg-white border-r border-gray-100 flex flex-col fixed top-0 left-0 h-full z-40">
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">D</div>
        <div>
          <p className="font-bold text-gray-900 text-sm leading-none">DentSoft</p>
          <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
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
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
            >
              <ItemIcon className={`w-4 h-4 shrink-0 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
