'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PatientHeader } from '@/components/patient/PatientHeader'
import { PatientFooter } from '@/components/patient/PatientFooter'
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

export default function PatientServicesPage() {
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PatientHeader />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              บริการทั้งหมด
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              เลือกบริการที่ต้องการเพื่อจองนัดหมาย ราคาที่แสดงเป็นราคาเริ่มต้น ราคาจริงขึ้นกับอาการที่ทันตแพทย์ตรวจ
            </p>
          </div>
          <Link
            href="/patient/dashboard"
            className={`px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-white transition shrink-0 ${focusRing}`}
          >
            กลับหน้าหลัก
          </Link>
        </div>

        {isLoading && (
          <p className="text-sm text-slate-400 text-center py-10">กำลังโหลดรายการบริการ...</p>
        )}

        {!isLoading && services.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-10">ยังไม่มีบริการที่เปิดให้จอง</p>
        )}

        {categories.map((category) => (
          <section key={category} className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services
                .filter((s) => s.category === category)
                .map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-slate-900 text-sm">{service.name}</h3>
                      {service.description && (
                        <p className="text-xs text-slate-400 line-clamp-2">{service.description}</p>
                      )}
                      <p className="text-sm font-extrabold text-blue-600 pt-1">
                        {formatPrice(service)}{' '}
                        <span className="text-xs font-normal text-slate-400">เริ่มต้น</span>
                      </p>
                    </div>
                    <Link
                      href={`/patient/booking?serviceId=${service.id}`}
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

      <PatientFooter />
    </div>
  )
}
