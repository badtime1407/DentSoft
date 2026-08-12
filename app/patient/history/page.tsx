'use client'

import Link from 'next/link'
import { PatientHeader } from '@/components/patient/PatientHeader'
import { PatientFooter } from '@/components/patient/PatientFooter'
import { focusRing } from '@/lib/shared/focus-ring'

const MOCK_PATIENT_HISTORY = [
  {
    id: 'h1',
    date: '24 พฤษภาคม 2567',
    service: 'ขูดหินปูน',
    dentist: 'ทพ. อนวัช ศรีประเสริฐ',
    branch: 'สาขา รัชดาภิเษก',
    status: 'นัดหมายสำเร็จ',
    statusBadge: 'bg-[#edf5ff] text-[#0066ff]',
    details: 'ทำความสะอาดคราบหินปูนทั่วปาก สภาพเหงือกปกติ',
  },
  {
    id: 'h2',
    date: '10 มีนาคม 2567',
    service: 'อุดฟัน',
    dentist: 'ทพญ. รัชดาพร วงศ์สุข',
    branch: 'สาขา รัชดาภิเษก',
    status: 'เสร็จสิ้น',
    statusBadge: 'bg-emerald-50 text-emerald-700',
    details: 'อุดฟันกรามด้านบนซ้ายด้วยวัสดุเรซินสีเหมือนฟัน',
  },
  {
    id: 'h3',
    date: '15 พฤศจิกายน 2566',
    service: 'ตรวจสุขภาพช่องปาก',
    dentist: 'ทพ. อนวัช ศรีประเสริฐ',
    branch: 'สาขา รัชดาภิเษก',
    status: 'เสร็จสิ้น',
    statusBadge: 'bg-emerald-50 text-emerald-700',
    details: 'ตรวจสุขภาพฟันประจำปี ไม่พบฟันผุเพิ่ม',
  },
]

export default function PatientHistoryPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PatientHeader />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              ประวัติการรักษา
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              รายการประวัติการรักษาและนัดหมายของคุณทั้งหมด
            </p>
          </div>
          <Link
            href="/patient/dashboard"
            className={`px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-white transition ${focusRing}`}
          >
            กลับหน้าหลัก
          </Link>
        </div>

        <div className="space-y-4">
          {MOCK_PATIENT_HISTORY.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-[#0066ff]">{item.date}</span>
                <span
                  className={`px-3 py-1 rounded-xl text-xs font-bold ${item.statusBadge}`}
                >
                  {item.status}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{item.service}</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  กับ {item.dentist} ({item.branch})
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">
                รายละเอียด: {item.details}
              </p>
            </div>
          ))}
        </div>
      </main>

      <PatientFooter />
    </div>
  )
}
