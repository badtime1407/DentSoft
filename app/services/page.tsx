'use client'

import Navbar from '@/components/layouts/Navbar'
import Footer from '@/components/layouts/Footer'
import { ServiceCatalog } from '@/components/services/ServiceCatalog'

export default function PublicServicesPage() {
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

        <ServiceCatalog ctaHref={() => '/login'} tone="gray" />
      </main>

      <Footer />
    </div>
  )
}
