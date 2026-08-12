'use client'

import Link from 'next/link'
import { PatientHeader } from '@/components/patient/PatientHeader'
import { PatientFooter } from '@/components/patient/PatientFooter'
import { focusRing } from '@/lib/shared/focus-ring'

export default function PatientChatPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PatientHeader />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              ปรึกษาออนไลน์
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              สอบถามและขอคำปรึกษาเกี่ยวกับสุขภาพช่องปากกับทีมทันตแพทย์
            </p>
          </div>
          <Link
            href="/patient/dashboard"
            className={`px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-white transition ${focusRing}`}
          >
            กลับหน้าหลัก
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto space-y-4 p-4 border-b border-slate-100">
            <div className="flex justify-start">
              <div className="bg-slate-100 text-slate-800 p-3 rounded-2xl text-xs sm:text-sm max-w-xs">
                สวัสดีครับ มีข้อสงสัยหรืออาการผิดปกติเกี่ยวกับสุขภาพช่องปากด้านใดสามารถสอบถามได้เลยครับ
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-[#0066ff] text-white p-3 rounded-2xl text-xs sm:text-sm max-w-xs">
                อยากสอบถามขั้นตอนการเตรียมตัวก่อนขูดหินปูนค่ะ
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-slate-100 text-slate-800 p-3 rounded-2xl text-xs sm:text-sm max-w-xs">
                รับประทานอาหารได้ตามปกติครับ และแนะนำแปรงฟันให้สะอาดก่อนเข้าพบทันตแพทย์ครับ
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <input
              type="text"
              placeholder="พิมพ์ข้อความคำถามที่นี่..."
              className={`flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm ${focusRing}`}
            />
            <button
              type="button"
              className={`px-6 py-2.5 bg-[#0066ff] text-white font-bold text-sm rounded-xl hover:bg-[#0052cc] transition ${focusRing}`}
            >
              ส่ง
            </button>
          </div>
        </div>
      </main>

      <PatientFooter />
    </div>
  )
}
