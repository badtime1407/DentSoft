'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IconChevronRight } from '@/components/shared/icons'
import { focusRing } from '@/lib/shared/focus-ring'

type Service = {
  id: string
  name: string
  description: string | null
  minPrice: number
  maxPrice: number
}

const FEATURED_SERVICE_NAMES = ['ตรวจฟันทั่วไป', 'อุดฟันสีเหมือนฟัน', 'ขูดหินปูน', 'ถอนฟัน']

function formatPrice(service: Service) {
  const min = service.minPrice.toLocaleString('th-TH')
  if (service.minPrice === service.maxPrice) return `฿${min}`
  return `฿${min} - ฿${service.maxPrice.toLocaleString('th-TH')}`
}

export default function RecommendedServicesSection() {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([])

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data: { services: Service[] }) => {
        const services = data.services ?? []
        const featured = FEATURED_SERVICE_NAMES
          .map((name) => services.find((s) => s.name === name))
          .filter((s): s is Service => Boolean(s))
        setFeaturedServices(featured)
      })
  }, [])

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">บริการแนะนำสำหรับคุณ</h2>
        <Link href="/services" className={`text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 ${focusRing}`}>
          ดูทั้งหมด
          <IconChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {featuredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-gray-900 text-sm">{service.name}</h3>
                <p className="text-sm font-extrabold text-blue-600 shrink-0 text-right">
                  {service.minPrice !== service.maxPrice && (
                    <span className="text-[11px] font-normal text-gray-400 mr-1">เริ่มต้น</span>
                  )}
                  {formatPrice(service)}
                </p>
              </div>
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
  )
}
