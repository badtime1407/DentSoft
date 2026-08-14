'use client'

import Link from 'next/link'
import { PatientHeader } from '@/components/patient/PatientHeader'
import { PatientFooter } from '@/components/patient/PatientFooter'
import {
  IconCalendar,
  IconClock,
  IconTooth,
  IconLocationPin,
  IconChevronRight,
  IconHeadset,
} from '@/components/shared/icons'
import { focusRing } from '@/lib/shared/focus-ring'

const TREATMENT_HISTORY_ITEMS = [
  {
    id: '1',
    dayNum: '15',
    monthYear: 'พ.ค. 2567',
    title: 'อุดฟัน',
    subDetail: 'ฟันกรามซี่ซ้ายบน (ซี่ที่ 26)',
    dentist: 'ทพ. อนวัช ศรีประเสริฐ',
    status: 'เสร็จสิ้น',
    statusStyle: 'bg-emerald-50 text-emerald-600',
  },
  {
    id: '2',
    dayNum: '20',
    monthYear: 'เม.ย. 2567',
    title: 'ขูดหินปูน',
    subDetail: 'ขูดหินปูนและเกลารากฟัน',
    dentist: 'ทพ. อนวัช ศรีประเสริฐ',
    status: 'เสร็จสิ้น',
    statusStyle: 'bg-emerald-50 text-emerald-600',
  },
  {
    id: '3',
    dayNum: '10',
    monthYear: 'มี.ค. 2567',
    title: 'อุดฟัน',
    subDetail: 'ฟันกรามซี่ขวาล่าง (ซี่ที่ 46)',
    dentist: 'ทพ. อนวัช ศรีประเสริฐ',
    status: 'เสร็จสิ้น',
    statusStyle: 'bg-emerald-50 text-emerald-600',
  },
  {
    id: '4',
    dayNum: '02',
    monthYear: 'ก.พ. 2567',
    title: 'จัดฟัน',
    subDetail: 'จัดฟันแบบโลหะ',
    dentist: 'ทพ. สรลยา จันทร์ประเสริฐ',
    status: 'กำลังรักษา',
    statusStyle: 'bg-amber-50 text-amber-600',
  },
  {
    id: '5',
    dayNum: '15',
    monthYear: 'ม.ค. 2567',
    title: 'ตรวจสุขภาพช่องปาก',
    subDetail: 'ตรวจสุขภาพประจำปี ไม่มีปัญหา',
    dentist: 'ทพ. อนวัช ศรีประเสริฐ',
    status: 'เสร็จสิ้น',
    statusStyle: 'bg-emerald-50 text-emerald-600',
  },
  {
    id: '6',
    dayNum: '05',
    monthYear: 'ธ.ค. 2566',
    title: 'ถอนฟัน',
    subDetail: 'ฟันกรามล่างซี่ซ้าย (ซี่ที่ 36)',
    dentist: 'ทพ. อนวัช ศรีประเสริฐ',
    status: 'ยกเลิก',
    statusStyle: 'bg-rose-50 text-rose-500',
  },
]

export default function PatientHistoryPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Patient Top Header */}
      <PatientHeader />

      {/* Main Body Content - Restored to Standard Max-Width (1200px) */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Page Title & Back to Dashboard Section (Outside of Card Container) */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ประวัติการรักษา
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              ประวัติการเข้ารับบริการและการรักษาทั้งหมดของคุณ
            </p>
          </div>

          {/* Back to Dashboard Button */}
          <Link
            href="/patient/dashboard"
            className={`inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:bg-white bg-white/80 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm ${focusRing}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>ย้อนกลับไปหน้าหลัก</span>
          </Link>
        </div>

        {/* 1. Latest Appointment Card (Matching Screenshot) */}
        <section className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-6 sm:p-7 space-y-4">
          {/* Card Title */}
          <div className="flex items-center gap-2.5 text-blue-600 font-bold text-base sm:text-lg">
            <IconCalendar className="w-5 h-5 text-blue-600" />
            <span>นัดหมายล่าสุด</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-1">
            <div className="flex items-center gap-6">
              {/* Left Date Box */}
              <div className="bg-[#f8fafc] rounded-xl py-4 px-4 text-center min-w-[120px] sm:min-w-[130px] flex flex-col justify-center items-center shrink-0 border border-slate-100/60 shadow-sm">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">24</span>
                <span className="text-xs font-bold text-blue-600 my-1">พ.ค. 2567</span>
                <span className="text-xs font-medium text-slate-500">(ศุกร์)</span>
              </div>

              {/* Appointment Info List */}
              <div className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
                <p className="flex items-center gap-2.5">
                  <IconClock className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>เวลา 10:00 น.</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>ทพ. อนวัช ศรีประเสริฐ</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <IconTooth className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>อุดฟัน</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <IconLocationPin className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>สาขา พหลโยธิน</span>
                </p>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                type="button"
                className={`px-5 py-2.5 border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shadow-sm ${focusRing}`}
              >
                <IconCalendar className="w-4 h-4 text-blue-600" />
                <span>เลื่อนนัด</span>
              </button>
              <button
                type="button"
                className={`px-5 py-2.5 border border-rose-300 text-rose-500 bg-[#fff5f5] hover:bg-rose-100/60 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shadow-sm ${focusRing}`}
              >
                <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6" />
                </svg>
                <span>ยกเลิกนัด</span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. All Treatment History Table Section (ประวัติการรักษาทั้งหมด - Compact & Balanced Height) */}
        <section className="space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900">
            ประวัติการรักษาทั้งหมด
          </h2>

          <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-[#f8fafc] text-xs font-bold text-slate-500 border-b border-slate-100">
                    <th className="py-3.5 px-6 w-[130px]">วันที่</th>
                    <th className="py-3.5 px-6">การรักษา</th>
                    <th className="py-3.5 px-6">ทันตแพทย์</th>
                    <th className="py-3.5 px-6 text-center w-[130px]">สถานะ</th>
                    <th className="py-3.5 px-4 w-[50px]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {TREATMENT_HISTORY_ITEMS.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    >
                      {/* Date */}
                      <td className="py-4 px-6 align-middle">
                        <div>
                          <span className="text-lg font-extrabold text-slate-900 block leading-tight">
                            {item.dayNum}
                          </span>
                          <span className="text-xs font-bold text-blue-600">
                            {item.monthYear}
                          </span>
                        </div>
                      </td>

                      {/* Treatment */}
                      <td className="py-4 px-6 align-middle">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-400 font-normal mt-0.5">
                            {item.subDetail}
                          </p>
                        </div>
                      </td>

                      {/* Dentist */}
                      <td className="py-4 px-6 align-middle text-xs font-medium text-slate-600">
                        {item.dentist}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-6 align-middle text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-xl text-xs font-bold ${item.statusStyle}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Arrow */}
                      <td className="py-4 px-4 align-middle text-right">
                        <IconChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 3. Support Banner (มีคำถามเกี่ยวกับประวัติการรักษา? - Compact Size) */}
        <section className="bg-[#f8fafc] rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-100/90 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm hover:scale-105 transition-transform duration-300">
              <IconHeadset className="w-6.5 h-6.5 sm:w-7 sm:h-7" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">
                มีคำถามเกี่ยวกับประวัติการรักษา?
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                ติดต่อเราได้ทุกช่องทาง
              </p>
            </div>
          </div>

          <button
            type="button"
            className={`px-4.5 py-1.5 border border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm ${focusRing}`}
          >
            ติดต่อคลินิก
          </button>
        </section>
      </main>

      {/* Patient Footer */}
      <PatientFooter />
    </div>
  )
}
