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
        <rect x="4" y="4" width="16" height="16" rx="4.5" />
        <circle cx="12" cy="12" r="3.2" />
        <circle cx="16.3" cy="7.7" r="0.6" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: 'โทรศัพท์',
    href: 'tel:021234567',
    icon: (
      <path d="M6.6 4.5h3l1.4 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.4v3a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 5.1 6.1a1.5 1.5 0 0 1 1.5-1.6Z" />
    ),
  },
]

export default function Footer() {
  return (
    <footer id="footer" className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
        <div>
          <Logo size="sm" />
          <p className="text-xs text-gray-400 mt-2">© 2569 DentSoft Clinic. All rights reserved.</p>
        </div>

        <div className="flex items-center gap-3">
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
      </div>
    </footer>
  )
}
