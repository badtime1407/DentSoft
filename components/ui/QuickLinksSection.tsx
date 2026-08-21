const quickLinks = [
  {
    title: 'ประวัติการรักษา',
    desc: 'ดูประวัติการรักษาของคุณ',
    icon: (
      <path d="M12 3c-2.5 0-4 1.5-6 1.5-3 0-5.5 3-5.5 7.5 0 4 1 8 2.5 11.5 1 2.5 1.5 5.5 3.5 5.5s1.5-3.5 2.5-6c.5-1.5 1.5-2 3-2s2.5.5 3 2c1 2.5 1 6 2.5 6s2.5-3 3.5-5.5c1.5-3.5 2.5-7.5 2.5-11.5C21.5 6 19 3 16 3c-2 0-3.5-1.5-6-1.5" />
    ),
  },
  {
    title: 'ปรับตารางนัด',
    desc: 'เปลี่ยนวันเวลานัดหมายใหม่',
    icon: (
      <>
        <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
        <path d="M8 3v4M16 3v4M3.5 10h17" />
      </>
    ),
  },
  {
    title: 'แผนที่ทางเข้า',
    desc: 'ดูเส้นทางมาคลินิก',
    icon: (
      <>
        <path d="M12 21s-7-6.5-7-11.5A7 7 0 0 1 19 9.5C19 14.5 12 21 12 21Z" />
        <circle cx="12" cy="9.5" r="2.25" />
      </>
    ),
  },
]

export default function QuickLinksSection() {
  return (
    <section id="services" className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-xl font-bold text-gray-900 mb-5">บริการที่คุณใช้บ่อย</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickLinks.map((item) => (
          <a
            key={item.title}
            href="#services"
            className="flex items-center gap-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm px-5 py-4 hover:border-blue-200 hover:shadow-md transition"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                {item.icon}
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </a>
        ))}
      </div>
    </section>
  )
}
