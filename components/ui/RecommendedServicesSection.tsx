/* eslint-disable @next/next/no-img-element */
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

const FEATURED_SERVICE_IMAGES: Record<string, string> = {
  ตรวจฟันทั่วไป: '/2.jpg',
  อุดฟันสีเหมือนฟัน: '/3.jpg',
  ขูดหินปูน: '/4.jpg',
  ถอนฟัน: '/1.jpg',
}

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
        const featured = Object.keys(FEATURED_SERVICE_IMAGES)
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
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="h-40 overflow-hidden relative bg-gray-100">
                <img
                  src={FEATURED_SERVICE_IMAGES[service.name]}
                  alt={service.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 space-y-1.5">
                <h3 className="font-semibold text-gray-900 text-sm">{service.name}</h3>
                {service.description && (
                  <p className="text-xs text-gray-400 line-clamp-2">{service.description}</p>
                )}
                <p className="text-sm font-bold text-blue-600 pt-2">
                  {formatPrice(service)} <span className="text-xs font-normal text-gray-400">เริ่มต้น</span>
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
