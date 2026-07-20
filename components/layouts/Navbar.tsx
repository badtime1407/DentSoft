import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-10 py-4 border-b sticky top-0 bg-white z-50">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🦷</span>
        <span className="text-xl font-bold text-blue-700">DentSoft Clinic</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm text-gray-600 font-medium">
        <a href="#services" className="hover:text-blue-600 transition">บริการ</a>
        <a href="#about" className="hover:text-blue-600 transition">เกี่ยวกับเรา</a>
        <a href="#team" className="hover:text-blue-600 transition">ทันตแพทย์</a>
        <a href="#contact" className="hover:text-blue-600 transition">ติดต่อ</a>
      </div>
      <Link
        href="/login"
        className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
      >
        จองนัดหมาย
      </Link>
    </nav>
  )
}