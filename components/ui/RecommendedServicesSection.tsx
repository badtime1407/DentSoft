const services = [
  {
    name: 'ตรวจสุขภาพช่องปาก',
    unit: 'ต่อครั้ง',
    price: 900,
    color: 'from-blue-50 to-blue-100',
    icon: (
      <path d="M12 3c-2.5 0-4 1.5-6 1.5-3 0-5.5 3-5.5 7.5 0 4 1 8 2.5 11.5 1 2.5 1.5 5.5 3.5 5.5s1.5-3.5 2.5-6c.5-1.5 1.5-2 3-2s2.5.5 3 2c1 2.5 1 6 2.5 6s2.5-3 3.5-5.5c1.5-3.5 2.5-7.5 2.5-11.5C21.5 6 19 3 16 3c-2 0-3.5-1.5-6-1.5" />
    ),
  },
  {
    name: 'อุดฟัน',
    unit: 'ต่อซี่',
    price: 1200,
    color: 'from-sky-50 to-sky-100',
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M9 12h6M12 9v6" />
      </>
    ),
  },
  {
    name: 'จัดฟัน',
    unit: 'เริ่มต้น',
    price: 35000,
    color: 'from-indigo-50 to-indigo-100',
    icon: (
      <>
        <path d="M4 8h16M4 12h16M4 16h16" />
      </>
    ),
  },
  {
    name: 'ฟอกสีฟัน',
    unit: 'ต่อครั้ง',
    price: 4500,
    color: 'from-cyan-50 to-cyan-100',
    icon: (
      <path d="M12 3c4 0 7 3 7 7 0 5-3 8-7 11-4-3-7-6-7-11 0-4 3-7 7-7Z" />
    ),
  },
]

export default function RecommendedServicesSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">บริการแนะนำสำหรับคุณ</h2>
        <a href="#services" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
          ดูทั้งหมด
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service) => (
          <div key={service.name} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className={`aspect-[4/3] bg-gradient-to-br ${service.color} flex items-center justify-center`}>
              <svg viewBox="0 0 24 24" className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {service.icon}
              </svg>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <p className="font-semibold text-gray-900 text-sm">{service.name}</p>
              <p className="text-xs text-gray-400 mb-3">{service.unit}</p>
              <p className="text-blue-600 font-bold mb-3 mt-auto">฿{service.price.toLocaleString()}</p>
              <button
                type="button"
                className="w-full px-3 py-2 border border-blue-200 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
              >
                จองบริการนี้
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
