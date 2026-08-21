import Link from 'next/link'

export default function HelpSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="bg-blue-50 rounded-3xl px-8 py-8 flex flex-col md:flex-row items-center gap-6">
        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm">
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
            <rect x="2.5" y="13" width="4.5" height="6" rx="1.5" />
            <rect x="17" y="13" width="4.5" height="6" rx="1.5" />
            <path d="M19.5 19v.5a3 3 0 0 1-3 3H13" />
          </svg>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-gray-900 font-bold text-lg mb-1">ต้องการความช่วยเหลือ?</h3>
          <p className="text-gray-500 text-sm">ทีมงานพร้อมให้คำปรึกษา</p>
        </div>
        <Link
          href="#footer"
          className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition shadow-sm shadow-blue-200 shrink-0"
        >
          ติดต่อเรา
        </Link>
        <div className="w-16 h-16 rounded-full bg-white items-center justify-center shrink-0 shadow-sm hidden md:flex">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 20l1.9-5.7A8.4 8.4 0 0 1 4 11.5 8.5 8.5 0 0 1 8.7 3.9a8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
          </svg>
        </div>
      </div>
    </section>
  )
}
