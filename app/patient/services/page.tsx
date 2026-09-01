'use client'

import Link from 'next/link'
import { PatientHeader } from '@/components/patient/PatientHeader'
import { PatientFooter } from '@/components/patient/PatientFooter'
import { ServiceCatalog } from '@/components/services/ServiceCatalog'
import { focusRing } from '@/lib/shared/focus-ring'

export default function PatientServicesPage() {
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

        <ServiceCatalog ctaHref={(id) => `/patient/booking?serviceId=${id}`} tone="slate" />
      </main>

      <PatientFooter />
    </div>
  )
}
