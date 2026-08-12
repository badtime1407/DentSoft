'use client'

import Link from 'next/link'
import { PatientHeader } from '@/components/patient/PatientHeader'
import { PatientFooter } from '@/components/patient/PatientFooter'
import {
  IconCalendar,
  IconTooth,
  IconFileText,
  IconChevronRight,
  IconClock,
} from '@/components/shared/icons'
import { focusRing } from '@/lib/shared/focus-ring'

const RECOMMENDED_SERVICES = [
  {
    id: '1',
    title: 'ตรวจสุขภาพช่องปาก',
    description: 'ตรวจเช็คฟันและเหงือกอย่างละเอียด',
    price: '900',
    image: '/1.jpg',
  },
  {
    id: '2',
    title: 'อุดฟัน',
    description: 'รักษาฟันผุด้วยวัสดุคุณภาพ',
    price: '1,200',
    image: '/2.jpg',
  },
  {
    id: '3',
    title: 'จัดฟัน',
    description: 'ปรับสภาพฟันให้สวยงามและเรียงตัวดี',
    price: '35,000',
    image: '/3.jpg',
  },
  {
    id: '4',
    title: 'ฟอกสีฟัน',
    description: 'ฟันขาวใส มั่นใจในรอยยิ้มของคุณ',
    price: '4,500',
    image: '/4.jpg',
  },
]

export default function PatientDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <PatientHeader />

      {/* Main Body Content */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* 1. Hero Banner Section */}
        <section className="bg-gradient-to-r from-[#eaf4ff] via-[#f0f7ff] to-[#e3f0ff] rounded-3xl p-8 sm:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-sky-100/60 shadow-sm">
          <div className="max-w-lg z-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              สวัสดีค่ะ, พิมพ์ชนก
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-3 leading-relaxed">
              ดูแลสุขภาพช่องปากของคุณ
              <br />
              ให้รอยยิ้มของคุณสดใสในทุกวัน
            </p>
            <Link
              href="/patient/booking"
              className={`inline-flex items-center justify-center bg-[#0066ff] hover:bg-[#0052cc] text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all mt-6 ${focusRing}`}
            >
              นัดหมายใหม่
            </Link>
          </div>
        </section>

        {/* 2. Next Appointment Card */}
        <section className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <IconCalendar className="w-5 h-5 text-[#0066ff]" />
              นัดหมายครั้งถัดไป
            </h2>
            <span className="bg-sky-50 text-[#0066ff] border border-sky-100 px-3 py-1 rounded-xl text-xs font-bold">
              อีก 2 วัน
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2">
            <div className="flex items-center gap-5">
              {/* Date Box */}
              <div className="bg-[#edf5ff] rounded-2xl p-4 text-center min-w-[115px] flex flex-col justify-center items-center shrink-0 border border-sky-100/50">
                <span className="text-xs font-semibold text-slate-500">พฤหัสบดี</span>
                <span className="text-3xl font-extrabold text-slate-900 my-0.5">24</span>
                <span className="text-xs font-bold text-[#0066ff]">พฤษภาคม 2567</span>
              </div>

              {/* Appointment Info */}
              <div className="space-y-1">
                <p className="text-xs font-bold text-[#0066ff] flex items-center gap-1">
                  <IconClock className="w-3.5 h-3.5" /> 10:00 น.
                </p>
                <p className="text-lg font-extrabold text-slate-900">ขูดหินปูน</p>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  กับ ทพ. อนวัช ศรีประเสริฐ
                </p>
                <p className="text-xs text-slate-400 font-medium pt-0.5">
                  สาขา รัชดาภิเษก
                </p>
              </div>
            </div>

            {/* Action Button */}
            <Link
              href="/patient/booking"
              className={`w-full sm:w-auto text-center px-5 py-2.5 border border-blue-200 text-[#0066ff] hover:bg-blue-50 rounded-xl text-sm font-semibold transition ${focusRing}`}
            >
              ดูรายละเอียด
            </Link>
          </div>
        </section>

        {/* 3. Frequently Used Services (บริการที่คุณใช้บ่อย) */}
        <section>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4">
            บริการที่คุณใช้บ่อย
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: ประวัติการรักษา */}
            <Link
              href="/patient/history"
              className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex items-center justify-between gap-3 group ${focusRing}`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-[#edf5ff] text-[#0066ff] flex items-center justify-center shrink-0 shadow-sm">
                  <IconTooth className="w-6.5 h-6.5" />
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-[#0066ff] transition truncate leading-snug">
                    ประวัติการรักษา
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium truncate mt-0.5">
                    ดูประวัติการรักษาของคุณ
                  </p>
                </div>
              </div>
              <IconChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#0066ff] transition shrink-0 ml-1" />
            </Link>

            {/* Card 2: ปรึกษาออนไลน์ */}
            <Link
              href="/patient/chat"
              className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex items-center justify-between gap-3 group ${focusRing}`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-[#edf5ff] text-[#0066ff] flex items-center justify-center shrink-0 shadow-sm">
                  <IconFileText className="w-6.5 h-6.5" />
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-[#0066ff] transition truncate leading-snug">
                    ปรึกษาออนไลน์
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium truncate mt-0.5">
                    สอบถามกับทีมทันตแพทย์
                  </p>
                </div>
              </div>
              <IconChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#0066ff] transition shrink-0 ml-1" />
            </Link>

            {/* Card 3: แผนที่การเดินทาง */}
            <a
              href="#map"
              className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex items-center justify-between gap-3 group ${focusRing}`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-[#edf5ff] text-[#0066ff] flex items-center justify-center shrink-0 shadow-sm">
                  <svg className="w-6.5 h-6.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6-5.333-6-10a6 6 0 0112 0c0 4.667-6 10-6 10z" />
                    <circle cx="12" cy="11" r="2.5" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-[#0066ff] transition truncate leading-snug">
                    แผนที่การเดินทาง
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium truncate mt-0.5">
                    ดูเส้นทางไปคลินิก
                  </p>
                </div>
              </div>
              <IconChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#0066ff] transition shrink-0 ml-1" />
            </a>
          </div>
        </section>

        {/* 4. Recommended Services Cards Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              บริการแนะนำสำหรับคุณ
            </h2>
            <Link
              href="/patient/booking"
              className={`text-sm font-bold text-[#0066ff] hover:underline ${focusRing}`}
            >
              ดูทั้งหมด
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {RECOMMENDED_SERVICES.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Service Card Image */}
                  <div className="h-40 overflow-hidden relative bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-1.5">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                    <p className="text-sm font-extrabold text-[#0066ff] pt-2">
                      ฿{item.price}{' '}
                      <span className="text-xs font-normal text-slate-400">เริ่มต้น</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Link
                    href="/patient/booking"
                    className={`w-full block text-center py-2 border border-blue-200 text-[#0066ff] hover:bg-blue-50 rounded-xl text-xs font-semibold transition ${focusRing}`}
                  >
                    ดูรายละเอียด
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Dental Care Tip Banner */}
        <section className="bg-gradient-to-r from-[#eaf4ff] via-[#f0f7ff] to-[#e3f0ff] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-sky-100/60 shadow-sm">
          <div className="space-y-2 max-w-lg">
            <h3 className="text-slate-900 font-bold text-base sm:text-lg">
              เคล็ดลับดูแลสุขภาพช่องปาก
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              แปรงฟันอย่างน้อยวันละ 2 ครั้ง ครั้งละ 2 นาที
              <br />
              และใช้ไหมขัดฟันเป็นประจำทุกวัน
            </p>
            <button
              type="button"
              className={`px-4 py-2 border border-blue-300 text-[#0066ff] hover:bg-white bg-white/80 rounded-xl text-xs font-semibold transition mt-3 ${focusRing}`}
            >
              อ่านเพิ่มเติม
            </button>
          </div>
        </section>

        {/* 6. Need Help Section */}
        <section className="bg-[#f4f8fc] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-slate-100 shadow-sm">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              ต้องการความช่วยเหลือ?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">ติดต่อเราได้ทุกช่องทาง</p>
            <button
              type="button"
              className={`px-4 py-2 border border-blue-200 text-[#0066ff] hover:bg-white bg-white/80 rounded-xl text-xs font-semibold transition mt-3 ${focusRing}`}
            >
              ติดต่อคลินิก
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <PatientFooter />
    </div>
  )
}
