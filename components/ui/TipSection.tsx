export default function TipSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-4">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl px-8 py-8 flex flex-col md:flex-row items-center gap-6 overflow-hidden">
        <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3c3 1.2 5.5 1.8 8 1.8 0 8.5-3 13-8 15.2-5-2.2-8-6.7-8-15.2 2.5 0 5-.6 8-1.8Z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-white font-bold text-lg mb-1.5">เคล็ดลับดูแลสุขภาพช่องปาก</h3>
          <p className="text-blue-50 text-sm leading-relaxed mb-3">
            แปรงฟันอย่างน้อยวันละ 2 ครั้ง ครั้งละ 2 นาที และใช้ไหมขัดฟันทุกวัน
          </p>
          <a href="#services" className="inline-block px-4 py-1.5 bg-white text-blue-600 rounded-full text-sm font-semibold hover:bg-blue-50 transition">
            อ่านเพิ่มเติม
          </a>
        </div>
        <div className="hidden md:flex w-32 h-24 rounded-2xl bg-white/10 items-center justify-center shrink-0 relative">
          <svg viewBox="0 0 64 48" className="w-20 h-16">
            <rect x="4" y="30" width="7" height="12" rx="2.5" fill="#dbeafe" />
            <ellipse cx="7.5" cy="28" rx="5.5" ry="3.5" fill="#bfdbfe" />
            <path d="M17 40 L44 12c1.6-1.6 4.4-1.6 6 0s1.6 4.4 0 6L25 40Z" fill="#ffffff" />
            <path d="M44 12l6 6M40 16l6 6M36 20l6 6" stroke="#93c5fd" strokeWidth="1.4" strokeLinecap="round" />
            <rect x="15" y="36" width="12" height="6" rx="3" fill="#93c5fd" />
          </svg>
        </div>
      </div>
    </section>
  )
}
