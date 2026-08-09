import Link from 'next/link'

const columns = [
  {
    title: 'เกี่ยวกับ',
    links: [
      { label: 'วิธีใช้งาน', href: '#steps' },
      { label: 'เข้าสู่ระบบ', href: '/login' },
      { label: 'สมัครสมาชิก', href: '/register' },
    ],
  },
  {
    title: 'ติดต่อ',
    links: [
      { label: 'support@dentsoft.local', href: 'mailto:support@dentsoft.local' },
      { label: 'โทร 02-123-4567', href: 'tel:021234567' },
    ],
  },
]

export default function Footer() {
  return (
    <footer id="footer" className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3.5c-1.6 0-2.4.9-3.6.9-1.9 0-3.4 1.7-3.4 4.3 0 2.4.6 4.8 1.4 6.8.6 1.5 1 3.5 2.2 3.5.9 0 .9-2.3 1.6-3.7.4-.8.8-1.3 1.8-1.3s1.4.5 1.8 1.3c.7 1.4.7 3.7 1.6 3.7 1.2 0 1.6-2 2.2-3.5.8-2 1.4-4.4 1.4-6.8 0-2.6-1.5-4.3-3.4-4.3-1.2 0-2-.9-3.6-.9Z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900">DentSoft</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            ระบบบริหารจัดการคลินิกทันตกรรม ครบวงจรสำหรับคนไข้และทีมงาน
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-semibold text-gray-900 mb-3">{col.title}</p>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-blue-600 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <p className="text-xs text-gray-400">© 2569 DentSoft Dental Management Platform. All rights reserved.</p>
          <a
            href="#top"
            aria-label="กลับขึ้นด้านบน"
            className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700 transition"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M6 11l6-6 6 6" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
