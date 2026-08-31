'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layouts/Navbar'
import Footer from '@/components/layouts/Footer'
import { focusRing } from '@/lib/shared/focus-ring'

type Service = {
  id: string
  name: string
  description: string | null
  category: string
  minPrice: number
  maxPrice: number
}

function formatPrice(service: Service) {
  const min = service.minPrice.toLocaleString('th-TH')
  if (service.minPrice === service.maxPrice) return `฿${min}`
  return `฿${min} - ฿${service.maxPrice.toLocaleString('th-TH')}`
}

export default function PublicServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => setServices(data.services ?? []))
      .finally(() => setIsLoading(false))
  }, [])

  const categories = Array.from(new Set(services.map((s) => s.category)))

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">บริการทั้งหมด</h1>
          <p className="text-sm text-gray-500 mt-1">
            ราคาที่แสดงเป็นราคาเริ่มต้น ราคาจริงขึ้นกับอาการที่ทันตแพทย์ตรวจ — เข้าสู่ระบบเพื่อจองนัดหมาย
          </p>
        </div>

        {isLoading && (
          <p className="text-sm text-gray-400 text-center py-10">กำลังโหลดรายการบริการ...</p>
        )}

        {!isLoading && services.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-10">ยังไม่มีบริการที่เปิดให้จอง</p>
        )}

        {categories.map((category) => (
          <section key={category} className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services
                .filter((s) => s.category === category)
                .map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-gray-900 text-sm">{service.name}</h3>
                      {service.description && (
                        <p className="text-xs text-gray-400 line-clamp-2">{service.description}</p>
                      )}
                      <p className="text-sm font-extrabold text-blue-600 pt-1">
                        {formatPrice(service)}{' '}
                        <span className="text-xs font-normal text-gray-400">เริ่มต้น</span>
                      </p>
                    </div>
                    <Link
                      href="/login"
                      className={`w-full block text-center py-2 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-semibold transition ${focusRing}`}
                    >
                      จองบริการนี้
                    </Link>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </main>

      <Footer />
    </div>
  )
}
