/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { IconChevronRight } from '@/components/shared/icons'
import { focusRing } from '@/lib/shared/focus-ring'

const services = [
  {
    id: '1',
    title: 'ตรวจสุขภาพช่องปาก',
    description: 'ตรวจเช็คฟันและเหงือกอย่างละเอียด',
    price: '฿900',
    image: '/2.jpg',
  },
  {
    id: '2',
    title: 'อุดฟัน',
    description: 'รักษาฟันผุด้วยวัสดุคุณภาพ',
    price: '฿1,200',
    image: '/3.jpg',
  },
  {
    id: '3',
    title: 'จัดฟัน',
    description: 'ปรับสภาพฟันให้สวยงามและเรียงตัวดี',
    price: '฿35,000',
    image: '/4.jpg',
  },
  {
    id: '4',
    title: 'ฟอกสีฟัน',
    description: 'ฟันขาวใส มั่นใจในรอยยิ้มของคุณ',
    price: '฿4,500',
    image: '/1.jpg',
  },
]

export default function RecommendedServicesSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">บริการแนะนำสำหรับคุณ</h2>
        <a href="#services" className={`text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 ${focusRing}`}>
          ดูทั้งหมด
          <IconChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="h-40 overflow-hidden relative bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 space-y-1.5">
                <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>
                <p className="text-sm font-bold text-blue-600 pt-2">
                  {item.price} <span className="text-xs font-normal text-gray-400">เริ่มต้น</span>
                </p>
              </div>
            </div>
            <div className="p-4 pt-0">
              <Link
                href="/login"
                className={`w-full block text-center py-2 border border-blue-200 text-blue-700 hover:bg-blue-50 rounded-lg text-xs font-semibold transition ${focusRing}`}
              >
                จองบริการนี้
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
