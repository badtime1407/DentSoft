'use client'

import { useState } from 'react'
import { IconTooth, IconSparkle, IconPhone, IconChevronRight } from '@/components/shared/icons'
import { ContactModal } from '@/components/shared/ContactModal'
import { focusRing } from '@/lib/shared/focus-ring'

const quickLinks = [
  {
    title: 'ประวัติการรักษา',
    desc: 'ดูประวัติการรักษาของคุณ',
    href: '/login',
    icon: IconTooth,
  },
  {
    title: 'ปรึกษา AI ผู้ช่วย',
    desc: 'สอบถามอาการเบื้องต้นได้ทันที',
    href: '/login',
    icon: IconSparkle,
  },
]

export default function QuickLinksSection() {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-xl font-bold text-gray-900 mb-5">บริการที่คุณใช้บ่อย</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickLinks.map((item) => {
          const ItemIcon = item.icon
          return (
            <a
              key={item.title}
              href={item.href}
              className={`flex items-center gap-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm px-5 py-4 hover:border-blue-200 hover:shadow-md transition group ${focusRing}`}
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ItemIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
              <IconChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition shrink-0" />
            </a>
          )
        })}

        <button
          type="button"
          onClick={() => setContactOpen(true)}
          className={`flex items-center gap-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm px-5 py-4 hover:border-blue-200 hover:shadow-md transition group text-left ${focusRing}`}
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <IconPhone className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm">ติดต่อเรา</p>
            <p className="text-xs text-gray-400">ดูช่องทางติดต่อคลินิก</p>
          </div>
          <IconChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition shrink-0" />
        </button>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} tone="gray" />
    </section>
  )
}
