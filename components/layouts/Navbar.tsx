import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Logo />

        <div className="flex items-center gap-2">
          <Link href="/login" className="px-4 py-2 border border-blue-200 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-50 transition">
            เข้าสู่ระบบ
          </Link>
          <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition shadow-sm shadow-blue-200">
            สมัครสมาชิก
          </Link>
        </div>
      </div>
    </nav>
  )
}
