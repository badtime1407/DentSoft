'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { focusRing } from '@/lib/shared/focus-ring'
import { SkeletonCard } from '@/components/shared/Skeleton'

type CatalogService = {
  id: string
  name: string
  description: string | null
  category: string
  minPrice: number
  maxPrice: number
}

function formatPrice(service: CatalogService) {
  return `฿${service.minPrice.toLocaleString('th-TH')}`
}

const toneClasses = {
  gray: { heading: 'text-gray-900', border: 'border-gray-100', muted: 'text-gray-400' },
  slate: { heading: 'text-slate-900', border: 'border-slate-100', muted: 'text-slate-400' },
} as const

export function ServiceCatalog({
  ctaHref,
  tone = 'gray',
}: {
  ctaHref: (serviceId: string) => string
  tone?: keyof typeof toneClasses
}) {
  const [services, setServices] = useState<CatalogService[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const c = toneClasses[tone]

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => setServices(data.services ?? []))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (services.length === 0) {
    return <p className={`text-sm ${c.muted} text-center py-10`}>ยังไม่มีบริการที่เปิดให้จอง</p>
  }

  const categories = Array.from(new Set(services.map((s) => s.category)))

  return (
    <>
      {categories.map((category) => (
        <section key={category} className="space-y-4">
          <h2 className={`text-base sm:text-lg font-bold ${c.heading}`}>{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services
              .filter((s) => s.category === category)
              .map((service) => (
                <div
                  key={service.id}
                  className={`bg-white rounded-2xl border ${c.border} p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className={`font-bold ${c.heading} text-sm`}>{service.name}</h3>
                      <p className="text-sm font-extrabold text-blue-600 shrink-0 text-right">
                        {service.minPrice !== service.maxPrice && (
                          <span className={`text-[11px] font-normal ${c.muted} mr-1`}>เริ่มต้น</span>
                        )}
                        {formatPrice(service)}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={ctaHref(service.id)}
                    className={`w-full block text-center py-2 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-semibold transition ${focusRing}`}
                  >
                    จองบริการนี้
                  </Link>
                </div>
              ))}
          </div>
        </section>
      ))}
    </>
  )
}
