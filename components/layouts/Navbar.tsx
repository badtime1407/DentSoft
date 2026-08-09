import Link from 'next/link'

const navLinks = [
  { href: '/', label: 'หน้าหลัก' },
  { href: '#steps', label: 'วิธีใช้งาน' },
  { href: '#footer', label: 'ติดต่อเรา' },
]

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3.5c-1.6 0-2.4.9-3.6.9-1.9 0-3.4 1.7-3.4 4.3 0 2.4.6 4.8 1.4 6.8.6 1.5 1 3.5 2.2 3.5.9 0 .9-2.3 1.6-3.7.4-.8.8-1.3 1.8-1.3s1.4.5 1.8 1.3c.7 1.4.7 3.7 1.6 3.7 1.2 0 1.6-2 2.2-3.5.8-2 1.4-4.4 1.4-6.8 0-2.6-1.5-4.3-3.4-4.3-1.2 0-2-.9-3.6-.9Z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-gray-900">DentSoft</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-blue-600 transition">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition">
            เข้าสู่ระบบ
          </Link>
          <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm shadow-blue-200">
            สมัครสมาชิก
          </Link>
        </div>
      </div>
    </nav>
  )
}
