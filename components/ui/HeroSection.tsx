import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
          จัดการนัดหมายทันตกรรมได้ง่าย
          <span className="text-blue-600"> ขึ้นกว่าที่เคย</span>
        </h1>
        <p className="text-gray-500 text-lg mb-8 leading-relaxed">
          แพลตฟอร์มจัดการคลินิกทันตกรรมครบวงจร ตั้งแต่จองนัดหมายออนไลน์
          ตรวจสอบประวัติการรักษา ไปจนถึงปรึกษาอาการเบื้องต้นผ่าน AI Chatbot
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/register" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm shadow-blue-200">
            เริ่มต้นใช้งาน
          </Link>
          <a href="#steps" className="px-6 py-3 border border-blue-200 text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition">
            ดูวิธีใช้งาน
          </a>
        </div>
      </div>

      <div className="relative">
        <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 200 200" className="w-3/5 h-3/5">
            <path
              d="M100 30c-13 0-20 7-30 7-16 0-28 14-28 36 0 20 5 40 12 57 5 12 8 29 18 29 8 0 8-19 13-31 3-7 7-11 15-11s12 4 15 11c5 12 5 31 13 31 10 0 13-17 18-29 7-17 12-37 12-57 0-22-12-36-28-36-10 0-17-7-30-7Z"
              fill="#ffffff"
              stroke="#93c5fd"
              strokeWidth="2.5"
            />
            <circle cx="82" cy="85" r="4.5" fill="#1e3a8a" />
            <circle cx="118" cy="85" r="4.5" fill="#1e3a8a" />
            <path d="M84 105q16 12 32 0" fill="none" stroke="#1e3a8a" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        </div>

        <div className="absolute bottom-4 left-4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
              <path d="M8 3v4M16 3v4M3.5 10h17" />
              <path d="M8.5 14.5l2 2 4.5-4.5" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">นัดหมายยืนยันแล้ว</p>
            <p className="text-xs text-gray-400">แจ้งเตือนอัตโนมัติก่อนถึงวันนัด</p>
          </div>
        </div>
      </div>
    </section>
  )
}
