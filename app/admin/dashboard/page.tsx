'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  IconClock,
  IconPulse,
  IconCheckCircle,
  IconXCircle,
  IconWallet,
  IconUserCheck,
  IconCalendarPlus,
  IconCreditCard,
  IconClipboardList,
  IconRotate,
  IconCalendar,
} from '@/components/admin/icons'
import { PageHeader } from '@/components/admin/PageHeader'
import { SearchBar } from '@/components/admin/SearchBar'
import { StatCard } from '@/components/admin/StatCard'
import { StatusBadge, type StatusTone } from '@/components/admin/StatusBadge'
import { focusRing } from '@/lib/admin/focus-ring'

type AppointmentStatus = 'CONFIRMED' | 'WAITING' | 'IN_TREATMENT' | 'COMPLETED' | 'CANCELLED'
type DentistStatus = 'AVAILABLE' | 'WITH_PATIENT' | 'BREAK'

type Appointment = {
  id: string
  time: string
  patient: string
  service: string
  dentist: string
  status: AppointmentStatus
  waitMinutes?: number
}

type Dentist = {
  name: string
  specialty: string
  status: DentistStatus
  currentPatient?: string
  nextAvailable: string
  bookedToday: number
}

type Activity = {
  time: string
  text: string
  kind: 'checkin' | 'payment' | 'treatment' | 'cancel' | 'booking' | 'complete' | 'reschedule'
}

/* ---------- Mock data ---------- */
const MOCK_NOW = '11:32'

const initialAppointments: Appointment[] = [
  { id: 'a1', time: '08:30', patient: 'สมชาย ใจดี', service: 'ขูดหินปูน', dentist: 'ทพ. วิชัย เก่งกล้า', status: 'COMPLETED' },
  { id: 'a2', time: '09:00', patient: 'อรุณี พงษ์เจริญ', service: 'ตรวจสุขภาพฟัน', dentist: 'ทพญ. สมหญิง รักดี', status: 'COMPLETED' },
  { id: 'a3', time: '09:30', patient: 'กิตติพงษ์ ศรีสุข', service: 'อุดฟัน', dentist: 'ทพ. วิชัย เก่งกล้า', status: 'COMPLETED' },
  { id: 'a4', time: '10:00', patient: 'ปิยะดา แสงทอง', service: 'เคลือบฟลูออไรด์', dentist: 'ทพญ. สมหญิง รักดี', status: 'COMPLETED' },
  { id: 'a5', time: '10:30', patient: 'วิชัย เก่งมาก', service: 'ถอนฟัน', dentist: 'ทพ. วิชัย เก่งกล้า', status: 'IN_TREATMENT' },
  { id: 'a6', time: '10:45', patient: 'สุนิสา อินทร์แก้ว', service: 'จัดฟัน (ปรับลวด)', dentist: 'ทพญ. สมหญิง รักดี', status: 'IN_TREATMENT' },
  { id: 'a7', time: '11:00', patient: 'สมหญิง รักดี', service: 'ฟอกสีฟัน', dentist: 'ทพ. วิชัย เก่งกล้า', status: 'WAITING', waitMinutes: 18 },
  { id: 'a8', time: '11:15', patient: 'ธีรพงศ์ รุ่งเรือง', service: 'รักษารากฟัน', dentist: 'ทพญ. สมหญิง รักดี', status: 'WAITING', waitMinutes: 9 },
  { id: 'a9', time: '11:30', patient: 'นภัสสร ทองดี', service: 'ครอบฟัน', dentist: 'ทพ. วิชัย เก่งกล้า', status: 'WAITING', waitMinutes: 2 },
  { id: 'a10', time: '13:00', patient: 'ประสิทธิ์ ดีมาก', service: 'ผ่าฟันคุด', dentist: 'ทพ. อนันต์ พงศ์ไพบูลย์', status: 'CANCELLED' },
  { id: 'a11', time: '13:30', patient: 'มานี มีสุข', service: 'จัดฟัน (ปรับลวด)', dentist: 'ทพญ. สมหญิง รักดี', status: 'CONFIRMED' },
  { id: 'a12', time: '14:00', patient: 'ชัยวัฒน์ บุญมี', service: 'ผ่าฟันคุด', dentist: 'ทพ. อนันต์ พงศ์ไพบูลย์', status: 'CONFIRMED' },
  { id: 'a13', time: '14:30', patient: 'วารี ใจงาม', service: 'อุดฟัน', dentist: 'ทพ. วิชัย เก่งกล้า', status: 'CANCELLED' },
  { id: 'a14', time: '15:00', patient: 'รัตนา ชูเกียรติ', service: 'ขูดหินปูน', dentist: 'ทพญ. สมหญิง รักดี', status: 'CONFIRMED' },
]

const dentists: Dentist[] = [
  { name: 'ทพ. วิชัย เก่งกล้า', specialty: 'ทันตกรรมทั่วไป', status: 'WITH_PATIENT', currentPatient: 'วิชัย เก่งมาก', nextAvailable: '11:15 น.', bookedToday: 6 },
  { name: 'ทพญ. สมหญิง รักดี', specialty: 'ทันตกรรมจัดฟัน', status: 'WITH_PATIENT', currentPatient: 'สุนิสา อินทร์แก้ว', nextAvailable: '11:30 น.', bookedToday: 5 },
  { name: 'ทพ. อนันต์ พงศ์ไพบูลย์', specialty: 'ศัลยกรรมช่องปาก', status: 'BREAK', nextAvailable: '13:00 น.', bookedToday: 3 },
]

const initialActivities: Activity[] = [
  { time: '11:22', text: 'เพิ่มนัดหมายใหม่ให้ รัตนา ชูเกียรติ เวลา 15:00 น.', kind: 'booking' },
  { time: '11:05', text: 'ประสิทธิ์ ดีมาก ยกเลิกนัดหมาย 13:00 น.', kind: 'cancel' },
  { time: '10:32', text: 'ทพ. วิชัย เริ่มการรักษา วิชัย เก่งมาก', kind: 'treatment' },
  { time: '09:48', text: 'รับชำระเงิน ฿1,200 จาก อรุณี พงษ์เจริญ', kind: 'payment' },
  { time: '09:02', text: 'เช็คอิน สมชาย ใจดี สำหรับนัด 08:30 น.', kind: 'checkin' },
]

const statusConfig: Record<AppointmentStatus, { label: string; tone: StatusTone }> = {
  CONFIRMED: { label: 'ยืนยันแล้ว', tone: 'sky' },
  WAITING: { label: 'รอคิว', tone: 'amber' },
  IN_TREATMENT: { label: 'กำลังรักษา', tone: 'cyan' },
  COMPLETED: { label: 'เสร็จสิ้น', tone: 'blue' },
  CANCELLED: { label: 'ยกเลิก', tone: 'rose' },
}

const dentistStatusConfig: Record<DentistStatus, { label: string; dot: string; text: string }> = {
  AVAILABLE: { label: 'ว่าง', dot: 'bg-blue-500', text: 'text-blue-700' },
  WITH_PATIENT: { label: 'กำลังตรวจ', dot: 'bg-cyan-500', text: 'text-cyan-700' },
  BREAK: { label: 'พัก', dot: 'bg-slate-400', text: 'text-slate-500' },
}

const activityIcon = {
  checkin: IconUserCheck,
  payment: IconCreditCard,
  treatment: IconPulse,
  cancel: IconXCircle,
  booking: IconCalendarPlus,
  complete: IconCheckCircle,
  reschedule: IconRotate,
} as const

const filterTabs: { id: 'ALL' | AppointmentStatus; label: string }[] = [
  { id: 'ALL', label: 'ทั้งหมด' },
  { id: 'WAITING', label: 'รอคิว' },
  { id: 'IN_TREATMENT', label: 'กำลังรักษา' },
  { id: 'COMPLETED', label: 'เสร็จสิ้น' },
  { id: 'CANCELLED', label: 'ยกเลิก' },
]

export default function AdminDashboard() {
  const [filter, setFilter] = useState<'ALL' | AppointmentStatus>('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
  const [activities, setActivities] = useState<Activity[]>(initialActivities)

  function logActivity(text: string, kind: Activity['kind']) {
    setActivities((prev) => [{ time: MOCK_NOW, text, kind }, ...prev])
  }

  function cancelAppointment(id: string) {
    const target = appointments.find((a) => a.id === id)
    if (!target) return
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'CANCELLED', waitMinutes: undefined } : a)))
    logActivity(`ยกเลิกนัดหมายของ ${target.patient} เวลา ${target.time} น.`, 'cancel')
  }

  function rescheduleAppointment(id: string) {
    const target = appointments.find((a) => a.id === id)
    if (!target) return
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'CONFIRMED' } : a)))
    logActivity(`จัดคิวใหม่ให้ ${target.patient} เรียบร้อยแล้ว`, 'reschedule')
  }

  const today = new Date().toLocaleDateString('th-TH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'สวัสดีตอนเช้า' : hour < 17 ? 'สวัสดีตอนบ่าย' : 'สวัสดีตอนเย็น'

  const counts = {
    total: appointments.length,
    waiting: appointments.filter((a) => a.status === 'WAITING').length,
    inTreatment: appointments.filter((a) => a.status === 'IN_TREATMENT').length,
    completed: appointments.filter((a) => a.status === 'COMPLETED').length,
    cancelled: appointments.filter((a) => a.status === 'CANCELLED').length,
  }

  const waitingQueue = [...appointments]
    .filter((a) => a.status === 'WAITING')
    .sort((a, b) => (b.waitMinutes ?? 0) - (a.waitMinutes ?? 0))

  const nextPatient = waitingQueue[0]

  const filteredAppointments = filter === 'ALL' ? appointments : appointments.filter((a) => a.status === filter)
  const visibleAppointments = filteredAppointments.filter(
    (a) => searchTerm.trim() === '' || a.patient.toLowerCase().includes(searchTerm.trim().toLowerCase())
  )

  const summaryCards = [
    { label: 'นัดหมายวันนี้', value: counts.total, sub: `${counts.total - counts.cancelled} คิวที่ยังดำเนินการ`, icon: IconCalendar },
    { label: 'กำลังรอคิว', value: counts.waiting, sub: nextPatient ? `รอนานสุด ${nextPatient.waitMinutes} นาที` : 'ไม่มีคนไข้รอ', icon: IconClock },
    { label: 'กำลังรักษา', value: counts.inTreatment, sub: `${counts.inTreatment} ห้องตรวจกำลังใช้งาน`, icon: IconPulse },
    { label: 'เสร็จสิ้นแล้ว', value: counts.completed, sub: `จาก ${counts.total} นัดวันนี้`, icon: IconCheckCircle },
    { label: 'ยกเลิก', value: counts.cancelled, sub: counts.cancelled > 0 ? 'ต้องติดตามจัดคิวใหม่' : 'ไม่มีนัดที่ยกเลิก', icon: IconXCircle },
  ]

  const quickActions = [
    { label: 'เช็คอินคนไข้', icon: IconUserCheck },
    { label: 'เพิ่มนัดหมาย', icon: IconCalendarPlus },
    { label: 'บันทึกการชำระเงิน', icon: IconCreditCard },
  ]

  return (
    <>
      <PageHeader
        eyebrow={`${greeting} คุณแอดมิน`}
        title="ภาพรวมคลินิกวันนี้"
        subtitle={today}
        actions={
          <>
            {quickActions.map((action) => {
              const ActionIcon = action.icon
              return (
                <button
                  key={action.label}
                  type="button"
                  className={`flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50/50 transition-all ${focusRing}`}
                >
                  <ActionIcon className="w-4 h-4" />
                  {action.label}
                </button>
              )
            })}
            <Link
              href="/admin/appointments"
              className={`flex items-center gap-2 px-3.5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 ${focusRing}`}
            >
              <IconClipboardList className="w-4 h-4" />
              ดูตารางทั้งหมด
            </Link>
          </>
        }
      />

      {/* Operational summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {summaryCards.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} icon={s.icon} />
        ))}
      </div>

      {/* Financial summary — separated from operational data */}
      <div className="mb-8">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">ภาพรวมการเงิน</p>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-center gap-4 max-w-md">
          <div className="w-11 h-11 rounded-xl bg-white text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
            <IconWallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">฿21,840</p>
            <p className="text-xs text-blue-600 font-medium mt-0.5">รายได้วันนี้ · +8.4% จากเมื่อวาน</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left column */}
        <div className="xl:col-span-2 space-y-6">

          {/* Appointment table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">นัดหมายวันนี้</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Today&apos;s appointments</p>
                </div>
                <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="ค้นหาชื่อคนไข้..." />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${focusRing} ${
                      filter === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-500 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50">
                    <th className="px-6 py-3 font-medium">เวลา</th>
                    <th className="px-6 py-3 font-medium">คนไข้</th>
                    <th className="px-6 py-3 font-medium">บริการ</th>
                    <th className="px-6 py-3 font-medium">ทันตแพทย์</th>
                    <th className="px-6 py-3 font-medium">สถานะ</th>
                    <th className="px-6 py-3 font-medium">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {visibleAppointments.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-mono font-medium text-gray-900 tabular-nums">{a.time}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-semibold">
                            {a.patient.charAt(0)}
                          </div>
                          <span className="text-gray-800">{a.patient}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{a.service}</td>
                      <td className="px-6 py-4 text-gray-600">{a.dentist}</td>
                      <td className="px-6 py-4">
                        <StatusBadge label={statusConfig[a.status].label} tone={statusConfig[a.status].tone} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {a.status === 'CANCELLED' ? (
                            <button
                              type="button"
                              onClick={() => rescheduleAppointment(a.id)}
                              className={`inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs font-medium transition px-2 py-1.5 rounded-md ${focusRing}`}
                            >
                              <IconRotate className="w-3.5 h-3.5" /> จัดคิวใหม่
                            </button>
                          ) : (
                            <>
                              <button type="button" className={`text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs font-medium transition px-2 py-1.5 rounded-md ${focusRing}`}>
                                แก้ไข
                              </button>
                              {(a.status === 'CONFIRMED' || a.status === 'WAITING') && (
                                <button
                                  type="button"
                                  onClick={() => cancelAppointment(a.id)}
                                  className={`text-rose-400 hover:text-rose-600 hover:bg-rose-50 text-xs font-medium transition px-2 py-1.5 rounded-md ${focusRing}`}
                                >
                                  ยกเลิก
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {visibleAppointments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">
                        {searchTerm.trim() !== '' ? 'ไม่พบคนไข้ที่ค้นหา' : 'ไม่มีนัดหมายในสถานะนี้'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3 border-t border-gray-50">
              <p className="text-xs text-gray-400">แสดง {visibleAppointments.length} จาก {appointments.length} รายการ</p>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Dentist availability */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">ทันตแพทย์วันนี้</h2>
              <p className="text-xs text-gray-400 mt-0.5">Dentist availability</p>
            </div>
            <ul className="divide-y divide-gray-50">
              {dentists.map((d) => (
                <li key={d.name} className="px-6 py-4">
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-semibold shrink-0">
                        {d.name.split(' ')[1]?.charAt(0) ?? d.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{d.name}</p>
                        <p className="text-xs text-gray-400 truncate">{d.specialty}</p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs font-medium shrink-0 ${dentistStatusConfig[d.status].text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${dentistStatusConfig[d.status].dot}`} />
                      {dentistStatusConfig[d.status].label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 rounded-lg px-2.5 py-1.5">
                      <p className="text-xs text-gray-400">คนไข้ปัจจุบัน</p>
                      <p className="text-xs font-medium text-gray-800 truncate">{d.currentPatient ?? '—'}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg px-2.5 py-1.5">
                      <p className="text-xs text-gray-400">ว่างอีกครั้ง</p>
                      <p className="text-xs font-medium text-gray-800">{d.status === 'AVAILABLE' ? 'ว่างตอนนี้' : d.nextAvailable}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{d.bookedToday} คิววันนี้</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">กิจกรรมล่าสุด</h2>
              <p className="text-xs text-gray-400 mt-0.5">Recent activity</p>
            </div>
            <ul className="divide-y divide-gray-50">
              {activities.slice(0, 6).map((item, i) => {
                const ActivityIcon = activityIcon[item.kind]
                return (
                  <li key={`${item.time}-${i}`} className="px-6 py-3.5 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <ActivityIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-700 leading-snug">{item.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5 tabular-nums">{item.time} น.</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
