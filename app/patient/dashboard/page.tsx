/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PatientHeader } from '@/components/patient/PatientHeader'
import { PatientFooter } from '@/components/patient/PatientFooter'
import {
  IconCalendarPlus,
  IconCalendar,
  IconTooth,
  IconSparkle,
  IconChevronRight,
  IconClock,
  IconHeadset,
  IconPhone,
} from '@/components/shared/icons'
import { ContactModal } from '@/components/shared/ContactModal'
import { SkeletonCard, SkeletonDetailPanel } from '@/components/shared/Skeleton'
import { focusRing } from '@/lib/shared/focus-ring'

type Service = {
  id: string
  name: string
  description: string | null
  minPrice: number
  maxPrice: number
}

type Appointment = {
  id: string
  date: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  service: { name: string }
  dentist: { firstName: string; lastName: string } | null
}

const THAI_DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']
const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
]

function formatTime(date: Date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function daysUntilLabel(date: Date) {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  const diffDays = Math.round((target.getTime() - startOfToday.getTime()) / 86400000)
  if (diffDays <= 0) return 'วันนี้'
  if (diffDays === 1) return 'พรุ่งนี้'
  return `อีก ${diffDays} วัน`
}

const FEATURED_SERVICE_NAMES = ['ตรวจฟันทั่วไป', 'อุดฟันสีเหมือนฟัน', 'ขูดหินปูน', 'ถอนฟัน']

function formatPrice(service: Service) {
  const min = service.minPrice.toLocaleString('th-TH')
  if (service.minPrice === service.maxPrice) return `฿${min}`
  return `฿${min} - ฿${service.maxPrice.toLocaleString('th-TH')}`
}

export default function PatientDashboard() {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([])
  const [firstName, setFirstName] = useState('')
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null)
  const [isLoadingAppointment, setIsLoadingAppointment] = useState(true)
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true)
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data: { services: Service[] }) => {
        const services = data.services ?? []
        const featured = FEATURED_SERVICE_NAMES
          .map((name) => services.find((s) => s.name === name))
          .filter((s): s is Service => Boolean(s))
        setFeaturedServices(featured)
      })
      .finally(() => setIsLoadingFeatured(false))
  }, [])

  useEffect(() => {
    fetch('/api/appointments')
      .then((res) => res.json())
      .then((data: { patient?: { firstName: string }; appointments?: Appointment[] }) => {
        setFirstName(data.patient?.firstName ?? '')
        const now = new Date()
        const upcoming = (data.appointments ?? []).find(
          (a) => a.status !== 'CANCELLED' && new Date(a.date) >= now
        )
        setNextAppointment(upcoming ?? null)
      })
      .finally(() => setIsLoadingAppointment(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <PatientHeader />

      {/* Main Body Content */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* 1. Hero Banner Section (Full Bleed Image 44.jpg) */}
        <section className="relative rounded-2xl overflow-hidden border border-slate-100/90 shadow-sm bg-blue-50 min-h-[260px] sm:min-h-[300px] flex items-center">
          {/* Background Image 44.jpg - Full Bleed Edge */}
          <img
            src="/44.jpg"
            alt="DentSoft Hero Banner"
            className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] object-cover object-center scale-[1.05] select-none pointer-events-none"
          />

          {/* Left Text & CTA Content */}
          <div className="relative z-10 p-8 sm:p-10 max-w-xl space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              สวัสดีค่ะ{firstName ? `, ${firstName}` : ''} <span className="text-blue-600">💙</span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed pt-1">
              ดูแลสุขภาพช่องปากของคุณ
              <br />
              ให้รอยยิ้มของคุณสดใสในทุกวัน
            </p>
            <div className="pt-3">
              <Link
                href="/patient/booking"
                className={`inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all ${focusRing}`}
              >
                <IconCalendarPlus className="w-5 h-5" />
                นัดหมายใหม่
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Next Appointment Card */}
        <section className="bg-white rounded-2xl border border-slate-100/90 p-6 sm:p-7 shadow-sm space-y-5">
          {/* Top Title & Badge */}
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-bold text-[#1e293b] flex items-center gap-2">
              <IconCalendar className="w-5 h-5 text-blue-600" />
              นัดหมายครั้งถัดไป
            </h2>
            {nextAppointment && (
              <span className="bg-blue-50 text-blue-600 px-3.5 py-1.5 rounded-lg text-xs font-bold">
                {daysUntilLabel(new Date(nextAppointment.date))}
              </span>
            )}
          </div>

          {isLoadingAppointment ? (
            <SkeletonDetailPanel />
          ) : !nextAppointment ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
              <p className="text-sm text-slate-500 font-medium">
                คุณยังไม่มีนัดหมายที่กำลังจะถึง
              </p>
              <Link
                href="/patient/booking"
                className={`inline-block px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-xs font-bold transition-all shadow-sm ${focusRing}`}
              >
                จองนัดหมายใหม่
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-1">
              <div className="flex items-center gap-6">
                {/* Date Box */}
                <div className="bg-blue-50 rounded-2xl py-4 px-5 text-center min-w-[125px] flex flex-col justify-center items-center shrink-0 border border-slate-100/60 shadow-sm">
                  <span className="text-xs font-medium text-slate-500">
                    {THAI_DAYS[new Date(nextAppointment.date).getDay()]}
                  </span>
                  <span className="text-4xl font-extrabold text-[#1e293b] my-1">
                    {new Date(nextAppointment.date).getDate()}
                  </span>
                  <div className="text-xs font-bold text-blue-600 leading-tight">
                    <p>{THAI_MONTHS[new Date(nextAppointment.date).getMonth()]}</p>
                    <p>{new Date(nextAppointment.date).getFullYear() + 543}</p>
                  </div>
                </div>

                {/* Appointment Info */}
                <div className="space-y-1.5">
                  <p className="text-sm font-bold text-blue-600 flex items-center gap-2">
                    <IconClock className="w-4.5 h-4.5" /> {formatTime(new Date(nextAppointment.date))} น.
                  </p>
                  <p className="text-base font-bold text-[#1e293b]">{nextAppointment.service.name}</p>
                  <p className="text-xs text-slate-400 font-medium">
                    {nextAppointment.dentist
                      ? `กับ ทพ. ${nextAppointment.dentist.firstName} ${nextAppointment.dentist.lastName}`
                      : 'รอคลินิกจัดทันตแพทย์ให้'}
                  </p>
                </div>
              </div>

              {/* Action Button (Bottom Right) */}
              <div className="w-full sm:w-auto text-right">
                <Link
                  href="/patient/history"
                  className={`inline-block w-full sm:w-auto text-center px-5 py-2 border border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm ${focusRing}`}
                >
                  ดูรายละเอียด
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* 3. Frequently Used Services (บริการที่คุณใช้บ่อย) */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            บริการที่คุณใช้บ่อย
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: ประวัติการรักษา */}
            <Link
              href="/patient/history"
              className={`flex items-center gap-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm px-5 py-4 hover:border-blue-200 hover:shadow-md transition group ${focusRing}`}
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <IconTooth className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm">ประวัติการรักษา</p>
                <p className="text-xs text-slate-400">ดูประวัติการรักษาของคุณ</p>
              </div>
              <IconChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition shrink-0" />
            </Link>

            {/* Card 2: ปรึกษาออนไลน์ */}
            <Link
              href="/patient/chat"
              className={`flex items-center gap-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm px-5 py-4 hover:border-blue-200 hover:shadow-md transition group ${focusRing}`}
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <IconSparkle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm">ปรึกษา AI ผู้ช่วย</p>
                <p className="text-xs text-slate-400">สอบถามอาการเบื้องต้นได้ทันที</p>
              </div>
              <IconChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition shrink-0" />
            </Link>

            {/* Card 3: ติดต่อเรา */}
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className={`flex items-center gap-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm px-5 py-4 hover:border-blue-200 hover:shadow-md transition group text-left ${focusRing}`}
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <IconPhone className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm">ติดต่อเรา</p>
                <p className="text-xs text-slate-400">ดูช่องทางติดต่อคลินิก</p>
              </div>
              <IconChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition shrink-0" />
            </button>
          </div>
        </section>

        <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} tone="slate" />

        {/* 4. Recommended Services Cards Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              บริการแนะนำสำหรับคุณ
            </h2>
            <Link
              href="/patient/services"
              className={`text-sm font-bold text-blue-600 hover:underline flex items-center gap-1 ${focusRing}`}
            >
              ดูทั้งหมด <IconChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {isLoadingFeatured
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : featuredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-slate-900 text-sm">{service.name}</h3>
                    <p className="text-sm font-extrabold text-blue-600 shrink-0 text-right">
                      {service.minPrice !== service.maxPrice && (
                        <span className="text-[11px] font-normal text-slate-400 mr-1">เริ่มต้น</span>
                      )}
                      {formatPrice(service)}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/patient/booking?serviceId=${service.id}`}
                  className={`w-full block text-center py-2 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-semibold transition ${focusRing}`}
                >
                  ดูรายละเอียด
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Dental Care Tip Banner (Matching Screenshot with 33.png & 11.jpg) */}
        <section className="relative rounded-2xl overflow-hidden border border-slate-100/90 shadow-sm bg-blue-50 min-h-[190px] sm:min-h-[220px] flex items-center">
          {/* Background / Right Side Image 11.jpg */}
          <img
            src="/11.jpg"
            alt="Dental Care Tip Background"
            className="absolute inset-0 w-full h-full object-cover object-right select-none pointer-events-none"
          />

          {/* Left Shield Graphic & Text Content */}
          <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 max-w-3xl">
            {/* Tooth Shield Badge 33.png - Larger Size */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 shrink-0 relative">
              <img
                src="/33.png"
                alt="Tooth Shield Graphic"
                className="w-full h-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Text Content */}
            <div className="space-y-2.5 text-left">
              <h3 className="text-blue-600 font-extrabold text-xl sm:text-2xl tracking-tight">
                เคล็ดลับดูแลสุขภาพช่องปาก
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
                แปรงฟันอย่างน้อยวันละ 2 ครั้ง ครั้งละ 2 นาที
                <br />
                และใช้ไหมขัดฟันเป็นประจำทุกวัน
              </p>
              <div className="pt-1.5">
                <button
                  type="button"
                  className={`px-5 py-2 border border-blue-600 text-blue-600 bg-blue-50/90 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm ${focusRing}`}
                >
                  อ่านเพิ่มเติม
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Need Help Section (Matching Screenshot with 99.png) */}
        <section className="bg-[#f8fafc] rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-100/90 shadow-sm relative overflow-hidden min-h-[140px]">
          {/* Left Content: Headset Icon + Text + Button */}
          <div className="flex items-center gap-6 z-10">
            {/* Soft Blue Headset Icon Container - Larger Icon */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm hover:scale-105 transition-transform duration-300">
              <IconHeadset className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>

            {/* Text & Button */}
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                ต้องการความช่วยเหลือ?
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                ติดต่อเราได้ทุกช่องทาง
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  className={`px-5 py-1.5 border border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm ${focusRing}`}
                >
                  ติดต่อคลินิก
                </button>
              </div>
            </div>
          </div>

          {/* Right Side 3D Chat Bubble Graphic (99.png) */}
          <div className="relative shrink-0 z-10">
            <img
              src="/99.png"
              alt="Need Help Graphic"
              className="w-32 h-28 sm:w-40 sm:h-36 object-contain pointer-events-none select-none drop-shadow-sm"
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <PatientFooter />
    </div>
  )
}
