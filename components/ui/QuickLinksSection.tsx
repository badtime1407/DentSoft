'use client'

import { useState } from 'react'
import { IconTooth, IconSparkle, IconPhone, IconChevronRight, IconX, IconLocationPin } from '@/components/shared/icons'
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

const contactDetails = [
  {
    text: '123 ถนนสุขุมวิท แขวงคลองตัน กรุงเทพฯ 10110',
    href: undefined,
    icon: IconLocationPin,
  },
  {
    text: 'โทร 02-123-4567',
    href: 'tel:021234567',
    icon: IconPhone,
  },
  {
    text: 'จันทร์-เสาร์ 09:00-19:00 น.',
    href: undefined,
    icon: IconTooth,
  },
]

export default function QuickLinksSection() {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <section id="services" className="max-w-6xl mx-auto px-6 py-10">
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

      {contactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setContactOpen(false)} />

          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-lg">ติดต่อคลินิก</h3>
              <button
                type="button"
                onClick={() => setContactOpen(false)}
                className={`p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition ${focusRing}`}
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>

            <ul className="space-y-3 text-sm text-gray-600">
              {contactDetails.map((item) => {
                const DetailIcon = item.icon
                return (
                  <li key={item.text} className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <DetailIcon className="w-4 h-4" />
                    </span>
                    {item.href ? (
                      <a href={item.href} className="hover:text-blue-600 transition pt-1.5">{item.text}</a>
                    ) : (
                      <span className="pt-1.5">{item.text}</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </section>
  )
}
