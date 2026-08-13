'use client'

import Link from 'next/link'
import { PatientHeader } from '@/components/patient/PatientHeader'
import { PatientFooter } from '@/components/patient/PatientFooter'
import { focusRing } from '@/lib/shared/focus-ring'

export default function PatientBookingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PatientHeader />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              จองนัดหมายใหม่
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              เลือกบริการ วันเวลา และสาขาที่ต้องการเข้ารับการรักษา
            </p>
          </div>
          <Link
            href="/patient/dashboard"
            className={`px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-white transition ${focusRing}`}
          >
            กลับหน้าหลัก
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6 max-w-2xl">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">เลือกรายการบริการ</label>
            <select className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm ${focusRing}`}>
              <option>ตรวจสุขภาพช่องปาก (฿900)</option>
              <option>ขูดหินปูน (฿1,200)</option>
              <option>อุดฟัน (฿1,200)</option>
              <option>ปรึกษาจัดฟัน (฿35,000)</option>
              <option>ฟอกสีฟัน (฿4,500)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">เลือกสาขา</label>
            <select className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm ${focusRing}`}>
              <option>สาขา รัชดาภิเษก</option>
              <option>สาขา สุขุมวิท</option>
              <option>สาขา สยาม</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">วันที่ต้องการนัด</label>
              <input
                type="date"
                defaultValue="2026-08-24"
                className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm ${focusRing}`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">เวลา</label>
              <select className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm ${focusRing}`}>
                <option>10:00 น.</option>
                <option>11:30 น.</option>
                <option>14:00 น.</option>
                <option>16:00 น.</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => alert('ยืนยันการจองนัดหมายเรียบร้อยแล้ว')}
            className={`w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-md transition ${focusRing}`}
          >
            ยืนยันการจองนัดหมาย
          </button>
        </div>
      </main>

      <PatientFooter />
    </div>
  )
}
