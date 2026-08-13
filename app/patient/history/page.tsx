'use client'

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

      {/* Main Body Content - Wider & Spaciously Padded Container */}
      <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 sm:px-8 py-9 space-y-9">
        {/* Page Title Section */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            ประวัติการรักษา
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            ประวัติการเข้ารับบริการและการรักษาทั้งหมดของคุณ
          </p>
        </div>

        {/* 1. Latest Appointment Card (นัดหมายล่าสุด - Spaciously Padded) */}
        <section className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-7 sm:p-9 space-y-5">
          {/* Card Title */}
          <div className="flex items-center gap-2 text-[#0055ff] font-bold text-base sm:text-lg">
            <IconCalendar className="w-5.5 h-5.5" />
            <span>นัดหมายล่าสุด</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pt-1">
            <div className="flex items-center gap-7">
              {/* Left Date Box - Larger & Wider */}
              <div className="bg-[#eff5ff] rounded-2xl py-5 px-6 text-center min-w-[145px] flex flex-col justify-center items-center shrink-0 border border-slate-100/60 shadow-sm">
                <span className="text-4xl sm:text-5xl font-extrabold text-slate-900">24</span>
                <span className="text-xs sm:text-sm font-bold text-[#0055ff] my-1">พ.ค. 2567</span>
                <span className="text-xs font-medium text-slate-500">(ศุกร์)</span>
              </div>

              {/* Appointment Info List - Larger Font */}
              <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 font-medium">
                <p className="flex items-center gap-3">
                  <IconClock className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                  <span>เวลา 10:00 น.</span>
                </p>
                <p className="flex items-center gap-3">
                  <svg className="w-4.5 h-4.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>ทพ. อนวัช ศรีประเสริฐ</span>
                </p>
                <p className="flex items-center gap-3">
                  <IconTooth className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                  <span>อุดฟัน</span>
                </p>
                <p className="flex items-center gap-3">
                  <IconLocationPin className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                  <span>สาขา พหลโยธิน</span>
                </p>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-3.5 w-full md:w-auto justify-end">
              <button
                type="button"
                className={`px-5 py-2.5 border border-[#0055ff] text-[#0055ff] bg-white hover:bg-blue-50 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-sm ${focusRing}`}
              >
                <IconCalendar className="w-4.5 h-4.5" />
                <span>เลื่อนนัด</span>
              </button>
              <button
                type="button"
                className={`px-5 py-2.5 border border-rose-300 text-rose-500 bg-white hover:bg-rose-50 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-sm ${focusRing}`}
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6" />
                </svg>
                <span>ยกเลิกนัด</span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. All Treatment History Table Section (ประวัติการรักษาทั้งหมด - Wider & Taller Rows) */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            ประวัติการรักษาทั้งหมด
          </h2>

          <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#f8fafc] text-xs sm:text-sm font-bold text-slate-500 border-b border-slate-100">
                    <th className="py-4 px-7 sm:px-8 w-[150px]">วันที่</th>
                    <th className="py-4 px-7 sm:px-8">การรักษา</th>
                    <th className="py-4 px-7 sm:px-8">ทันตแพทย์</th>
                    <th className="py-4 px-7 sm:px-8 text-center w-[150px]">สถานะ</th>
                    <th className="py-4 px-6 w-[60px]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {TREATMENT_HISTORY_ITEMS.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    >
                      {/* Date */}
                      <td className="py-5 px-7 sm:px-8 align-middle">
                        <div>
                          <span className="text-xl sm:text-2xl font-extrabold text-slate-900 block leading-tight">
                            {item.dayNum}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-[#0055ff]">
                            {item.monthYear}
                          </span>
                        </div>
                      </td>

                      {/* Treatment */}
                      <td className="py-5 px-7 sm:px-8 align-middle">
                        <div>
                          <p className="font-bold text-slate-900 text-sm sm:text-base">
                            {item.title}
                          </p>
                          <p className="text-xs sm:text-sm text-slate-400 font-normal mt-0.5">
                            {item.subDetail}
                          </p>
                        </div>
                      </td>

                      {/* Dentist */}
                      <td className="py-5 px-7 sm:px-8 align-middle text-xs sm:text-sm font-medium text-slate-600">
                        {item.dentist}
                      </td>

                      {/* Status Badge */}
                      <td className="py-5 px-7 sm:px-8 align-middle text-center">
                        <span
                          className={`inline-block px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold ${item.statusStyle}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Arrow */}
                      <td className="py-5 px-6 align-middle text-right">
                        <IconChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#0055ff] transition" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 3. Support Banner (มีคำถามเกี่ยวกับประวัติการรักษา?) */}
        <section className="bg-[#f8fafc] rounded-2xl p-7 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-100/90 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-[#edf4ff] text-[#0055ff] flex items-center justify-center shrink-0 shadow-sm">
              <IconHeadset className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                มีคำถามเกี่ยวกับประวัติการรักษา?
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                ติดต่อเราได้ทุกช่องทาง
              </p>
            </div>
          </div>

          <button
            type="button"
            className={`px-6 py-2.5 border border-[#0055ff] text-[#0055ff] bg-white hover:bg-[#0055ff] hover:text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ${focusRing}`}
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
