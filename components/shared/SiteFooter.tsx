import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <path d="M14 9h2.5V6.5h-2.5c-1.9 0-3.5 1.6-3.5 3.5v2H8.5v3H10.5v6.5h3V14.5h2.3l.7-3H13.5v-1.5c0-.55.45-1 .5-1Z" />
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="16.3" cy="7.7" r="0.6" fill="currentColor" stroke="none" />
      </>
    ),
  },
]

const contactItems = [
  {
    text: '123 ถนนสุขุมวิท แขวงคลองตัน กรุงเทพฯ 10110',
    href: undefined,
    icon: (
      <>
        <path d="M12 21s-7-6.5-7-11.5A7 7 0 0 1 19 9.5C19 14.5 12 21 12 21Z" />
        <circle cx="12" cy="9.5" r="2.25" />
      </>
    ),
  },
  {
    text: 'โทร 02-123-4567',
    href: 'tel:021234567',
    icon: <path d="M6.6 4.5h3l1.4 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.4v3a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 5.1 6.1a1.5 1.5 0 0 1 1.5-1.6Z" />,
  },
  {
    text: 'support@dentsoft.local',
    href: 'mailto:support@dentsoft.local',
    icon: (
      <>
        <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
        <path d="m4.5 7 7.5 6 7.5-6" />
      </>
    ),
  },
  {
    text: 'จันทร์-เสาร์ 09:00-19:00 น.',
    href: undefined,
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </>
    ),
  },
]

const toneClasses = {
  gray: { border: 'border-gray-100', heading: 'text-gray-900', body: 'text-gray-500', muted: 'text-gray-400' },
  slate: { border: 'border-slate-100', heading: 'text-slate-900', body: 'text-slate-500', muted: 'text-slate-400' },
} as const

export function SiteFooter({
  quickLinks,
  tone = 'gray',
  id,
  containerClassName = 'max-w-6xl px-6',
  wrapperClassName = '',
}: {
  quickLinks: { label: string; href: string }[]
  tone?: keyof typeof toneClasses
  id?: string
  containerClassName?: string
  wrapperClassName?: string
}) {
  const year = new Date().getFullYear() + 543
  const c = toneClasses[tone]

  return (
    <footer id={id} className={`bg-white border-t ${c.border} ${wrapperClassName}`}>
      <div className={`${containerClassName} mx-auto py-12 grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-10`}>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className={`text-sm font-semibold ${c.heading} mb-3`}>ติดต่อเรา</p>
            <ul className={`space-y-2.5 text-sm ${c.body}`}>
              {contactItems.map((item) => (
                <li key={item.text} className="flex items-start gap-2.5">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    {item.icon}
                  </svg>
                  {item.href ? (
                    <a href={item.href} className="hover:text-blue-600 transition">{item.text}</a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={`text-sm font-semibold ${c.heading} mb-3`}>ลิงก์ด่วน</p>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={`text-sm ${c.body} hover:text-blue-600 transition`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <Logo size="sm" className="mb-3" />
          <p className={`text-sm ${c.muted} leading-relaxed mb-4`}>
            ดูแลสุขภาพช่องปากของคุณให้ครบวงจร ด้วยทีมทันตแพทย์และเทคโนโลยีที่ทันสมัย
          </p>
          <div className="flex items-center gap-3 mb-5">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  {social.icon}
                </svg>
              </a>
            ))}
          </div>
          <p className={`text-xs ${c.muted}`}>© {year} DentSoft Clinic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
