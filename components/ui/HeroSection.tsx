import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
          ยินดีต้อนรับสู่
          <br />
          <span className="text-blue-600">DentSoft Clinic</span>
        </h1>
        <p className="text-gray-500 text-lg mb-8 leading-relaxed">
          ดูแลสุขภาพช่องปากของคุณ ให้ครบวงจรด้วยทีมงานมืออาชีพ
        </p>
        <div className="flex flex-wrap gap-3 mb-4">
          <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition shadow-sm shadow-blue-200">
            เข้าสู่ระบบ
          </Link>
          <a href="#services" className="px-6 py-3 border border-blue-200 text-blue-700 rounded-full font-medium hover:bg-blue-50 transition">
            ดูบริการ
          </a>
        </div>
        <p className="text-sm text-gray-400 flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          จองนัดง่าย ปลอดภัย และรวดเร็วทันใจ
        </p>
      </div>

      <div className="relative">
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-blue-100/70 blur-xl" />
        <div className="absolute -bottom-8 -left-4 w-28 h-28 rounded-full bg-blue-50 blur-xl" />

        <div className="relative aspect-square bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 rounded-full flex items-center justify-center overflow-hidden shadow-inner">
          <svg viewBox="0 0 200 200" className="w-3/5 h-3/5 drop-shadow-lg">
            <ellipse cx="100" cy="178" rx="42" ry="8" fill="#bfdbfe" opacity="0.6" />
            <path
              d="M100 26c-14 0-21 8-32 8-17 0-30 15-30 38 0 21 5 42 13 60 5 13 9 30 19 30 9 0 9-20 14-33 3-7 8-12 16-12s13 5 16 12c5 13 5 33 14 33 10 0 14-17 19-30 8-18 13-39 13-60 0-23-13-38-30-38-11 0-18-8-32-8Z"
              fill="#ffffff"
              stroke="#93c5fd"
              strokeWidth="2.5"
            />
            <circle cx="82" cy="82" r="4.5" fill="#1e3a8a" />
            <circle cx="118" cy="82" r="4.5" fill="#1e3a8a" />
            <path d="M84 102q16 12 32 0" fill="none" stroke="#1e3a8a" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </section>
  )
}
