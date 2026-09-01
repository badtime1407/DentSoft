'use client'

import { IconLocationPin, IconPhone, IconTooth, IconX } from '@/components/shared/icons'
import { focusRing } from '@/lib/shared/focus-ring'

export const contactDetails = [
  { text: '123 ถนนสุขุมวิท แขวงคลองตัน กรุงเทพฯ 10110', href: undefined, icon: IconLocationPin },
  { text: 'โทร 02-123-4567', href: 'tel:021234567', icon: IconPhone },
  { text: 'จันทร์-เสาร์ 09:00-19:00 น.', href: undefined, icon: IconTooth },
]

const toneClasses = {
  gray: { heading: 'text-gray-900', body: 'text-gray-600', close: 'text-gray-400 hover:bg-gray-50 hover:text-gray-600' },
  slate: { heading: 'text-slate-900', body: 'text-slate-600', close: 'text-slate-400 hover:bg-slate-50 hover:text-slate-600' },
} as const

export function ContactModal({
  open,
  onClose,
  tone = 'gray',
}: {
  open: boolean
  onClose: () => void
  tone?: keyof typeof toneClasses
}) {
  if (!open) return null
  const c = toneClasses[tone]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-bold ${c.heading} text-lg`}>ติดต่อคลินิก</h3>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg transition ${c.close} ${focusRing}`}
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>

        <ul className={`space-y-3 text-sm ${c.body}`}>
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
  )
}
