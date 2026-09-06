'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  IconClock,
  IconPulse,
  IconCheckCircle,
  IconXCircle,
  IconUserCheck,
  IconCalendarPlus,
  IconClipboardList,
  IconRotate,
  IconCalendar,
} from '@/components/admin/icons'
import { PageHeader } from '@/components/shared/PageHeader'
import { SearchBar } from '@/components/admin/SearchBar'
import { StatCard } from '@/components/shared/StatCard'
import { SkeletonStatCard, SkeletonTableRows, SkeletonListRows } from '@/components/shared/Skeleton'
import { StatusBadge, type StatusTone } from '@/components/shared/StatusBadge'
import { focusRing } from '@/lib/shared/focus-ring'
import type { AdminAppointment, BookingStatus } from '@/app/admin/appointments/types'
import type { AdminDentist } from '@/app/admin/dentists/types'

type DentistStatus = 'AVAILABLE' | 'WITH_PATIENT' | 'BREAK'

type Activity = {
  time: string
  text: string
  icon: typeof IconCalendarPlus
}

const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000

function splitBangkok(iso: string) {
  const shifted = new Date(new Date(iso).getTime() + BANGKOK_OFFSET_MS)
  const isoShifted = shifted.toISOString()
  return { date: isoShifted.slice(0, 10), time: isoShifted.slice(11, 16) }
}

function todayInBangkok() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Bangkok' })
}

function nowTimeInBangkok() {
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date())
}

const statusConfig: Record<BookingStatus, { label: string; tone: StatusTone }> = {
  PENDING: { label: 'รอยืนยัน', tone: 'amber' },
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

const activityConfig: Record<BookingStatus, { icon: typeof IconCalendarPlus; text: (name: string) => string }> = {
  PENDING: { icon: IconCalendarPlus, text: (name) => `มีคำขอจองใหม่จาก ${name}` },
  CONFIRMED: { icon: IconRotate, text: (name) => `ยืนยันนัดหมายของ ${name} แล้ว` },
  WAITING: { icon: IconUserCheck, text: (name) => `${name} มาถึงคลินิกแล้ว รอคิว` },
  IN_TREATMENT: { icon: IconPulse, text: (name) => `เริ่มการรักษา ${name}` },
  COMPLETED: { icon: IconCheckCircle, text: (name) => `${name} เสร็จสิ้นการรักษาแล้ว` },
  CANCELLED: { icon: IconXCircle, text: (name) => `ยกเลิกนัดหมายของ ${name}` },
}

const filterTabs: { id: 'ALL' | BookingStatus; label: string }[] = [
  { id: 'ALL', label: 'ทั้งหมด' },
  { id: 'PENDING', label: 'รอยืนยัน' },
  { id: 'CONFIRMED', label: 'ยืนยันแล้ว' },
  { id: 'WAITING', label: 'รอคิว' },
  { id: 'IN_TREATMENT', label: 'กำลังรักษา' },
  { id: 'COMPLETED', label: 'เสร็จสิ้น' },
  { id: 'CANCELLED', label: 'ยกเลิก' },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<AdminAppointment[]>([])
  const [dentists, setDentists] = useState<AdminDentist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | BookingStatus>('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/appointments').then((r) => r.json()),
      fetch('/api/dentists').then((r) => r.json()),
    ])
      .then(([apptData, dentistData]) => {
        setAppointments(apptData.appointments ?? [])
        setDentists(dentistData.dentists ?? [])
      })
      .finally(() => setIsLoading(false))
  }, [])

  async function patchAppointment(id: string, data: Record<string, unknown>) {
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) return null
    const result = await res.json()
    setAppointments((prev) => prev.map((a) => (a.id === id ? result.appointment : a)))
    return result.appointment as AdminAppointment
  }

  function cancelAppointment(id: string) {
    patchAppointment(id, { status: 'CANCELLED' })
  }

  function rescheduleAppointment(id: string) {
    patchAppointment(id, { status: 'CONFIRMED' })
  }

  const today = useMemo(() => todayInBangkok(), [])
  const nowTime = useMemo(() => nowTimeInBangkok(), [])
  const dayOfWeek = useMemo(() => new Date(`${today}T00:00:00`).getDay(), [today])

  const todaysAppointments = useMemo(
    () => appointments.filter((a) => splitBangkok(a.date).date === today),
    [appointments, today]
  )

  const todayLabel = new Date().toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'สวัสดีตอนเช้า' : hour < 17 ? 'สวัสดีตอนบ่าย' : 'สวัสดีตอนเย็น'

  const counts = {
    total: todaysAppointments.length,
    waiting: todaysAppointments.filter((a) => a.status === 'CONFIRMED' || a.status === 'WAITING').length,
    inTreatment: todaysAppointments.filter((a) => a.status === 'IN_TREATMENT').length,
    completed: todaysAppointments.filter((a) => a.status === 'COMPLETED').length,
    cancelled: todaysAppointments.filter((a) => a.status === 'CANCELLED').length,
  }

  const nextPatient = [...todaysAppointments]
    .filter((a) => a.status === 'CONFIRMED' || a.status === 'WAITING')
    .sort((a, b) => splitBangkok(a.date).time.localeCompare(splitBangkok(b.date).time))[0]

  const filteredAppointments = filter === 'ALL' ? todaysAppointments : todaysAppointments.filter((a) => a.status === filter)
  const visibleAppointments = filteredAppointments.filter(
    (a) => searchTerm.trim() === '' || a.patientName.toLowerCase().includes(searchTerm.trim().toLowerCase())
  )

  const dentistViews = useMemo(() => {
    return dentists.map((d) => {
      const daySchedule = d.schedule[dayOfWeek]
      const apptsToday = todaysAppointments
        .filter((a) => a.dentistId === d.id)
        .sort((a, b) => splitBangkok(a.date).time.localeCompare(splitBangkok(b.date).time))

      const inTreatment = apptsToday.find((a) => a.status === 'IN_TREATMENT')

      let status: DentistStatus
      let currentPatient: string | undefined
      let nextAvailable: string

      if (inTreatment) {
        status = 'WITH_PATIENT'
        currentPatient = inTreatment.patientName
        const currentTime = splitBangkok(inTreatment.date).time
        const next = apptsToday.find(
          (a) => (a.status === 'CONFIRMED' || a.status === 'WAITING') && splitBangkok(a.date).time > currentTime
        )
        nextAvailable = next ? `${splitBangkok(next.date).time} น.` : daySchedule?.active ? `${daySchedule.endTime} น.` : '-'
      } else if (!daySchedule?.active || nowTime < daySchedule.startTime || nowTime > daySchedule.endTime) {
        status = 'BREAK'
        nextAvailable = daySchedule?.active ? `${daySchedule.startTime} น.` : '-'
      } else {
        status = 'AVAILABLE'
        nextAvailable = 'ว่างตอนนี้'
      }

      return {
        name: `${d.title} ${d.firstName} ${d.lastName}`,
        specialty: d.specialty,
        status,
        currentPatient,
        nextAvailable,
        bookedToday: d.bookedToday,
      }
    })
  }, [dentists, todaysAppointments, dayOfWeek, nowTime])

  const activities: Activity[] = useMemo(() => {
    return [...appointments]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 6)
      .map((a) => ({
        time: splitBangkok(a.updatedAt).time,
        text: activityConfig[a.status].text(a.patientName),
        icon: activityConfig[a.status].icon,
      }))
  }, [appointments])

  const summaryCards = [
    { label: 'นัดหมายวันนี้', value: counts.total, sub: `${counts.total - counts.cancelled} คิวที่ยังดำเนินการ`, icon: IconCalendar },
    { label: 'กำลังรอคิว', value: counts.waiting, sub: nextPatient ? `คิวถัดไป ${splitBangkok(nextPatient.date).time} น.` : 'ไม่มีคนไข้รอ', icon: IconClock },
    { label: 'กำลังรักษา', value: counts.inTreatment, sub: `${counts.inTreatment} ห้องตรวจกำลังใช้งาน`, icon: IconPulse },
    { label: 'เสร็จสิ้นแล้ว', value: counts.completed, sub: `จาก ${counts.total} นัดวันนี้`, icon: IconCheckCircle },
    { label: 'ยกเลิก', value: counts.cancelled, sub: counts.cancelled > 0 ? 'ต้องติดตามจัดคิวใหม่' : 'ไม่มีนัดที่ยกเลิก', icon: IconXCircle },
  ]

  return (
    <>
      <PageHeader
        eyebrow={`${greeting} คุณแอดมิน`}
        title="ภาพรวมคลินิกวันนี้"
        subtitle={todayLabel}
        actions={
          <Link
            href="/admin/reports"
            className={`flex items-center gap-2 px-3.5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 ${focusRing}`}
          >
            <IconClipboardList className="w-4 h-4" />
            ดูรายงานทั้งหมด
          </Link>
        }
      />

      {/* Operational summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonStatCard key={i} />)
          : summaryCards.map((s) => (
              <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} icon={s.icon} />
            ))}
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
                {isLoading ? (
                  <tbody>
                    <SkeletonTableRows rows={5} columns={6} />
                  </tbody>
                ) : (
                <tbody className="divide-y divide-gray-50">
                  {visibleAppointments.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-mono font-medium text-gray-900 tabular-nums">{splitBangkok(a.date).time}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-semibold">
                            {a.patientName.charAt(0)}
                          </div>
                          <span className="text-gray-800">{a.patientName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{a.serviceName}</td>
                      <td className="px-6 py-4 text-gray-600">{a.dentistName ?? '-'}</td>
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
                              <button
                                type="button"
                                onClick={() => router.push(`/admin/appointments?requestId=${a.id}`)}
                                className={`text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs font-medium transition px-2 py-1.5 rounded-md ${focusRing}`}
                              >
                                แก้ไข
                              </button>
                              {(a.status === 'CONFIRMED' || a.status === 'WAITING' || a.status === 'PENDING') && (
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
                )}
              </table>
            </div>

            <div className="px-6 py-3 border-t border-gray-50">
              <p className="text-xs text-gray-400">แสดง {visibleAppointments.length} จาก {todaysAppointments.length} รายการ</p>
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
            {isLoading ? (
              <SkeletonListRows rows={3} />
            ) : (
            <ul className="divide-y divide-gray-50">
              {dentistViews.map((d) => (
                <li key={d.name} className="px-6 py-4">
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-semibold shrink-0">
                        {d.name.split(' ')[1]?.charAt(0) ?? d.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{d.name}</p>
                        <p className="text-xs text-gray-400 truncate">{d.specialty ?? '-'}</p>
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

              {dentistViews.length === 0 && (
                <li className="px-6 py-8 text-center text-sm text-gray-400">ยังไม่มีทันตแพทย์ในระบบ</li>
              )}
            </ul>
            )}
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">กิจกรรมล่าสุด</h2>
              <p className="text-xs text-gray-400 mt-0.5">Recent activity</p>
            </div>
            {isLoading ? (
              <SkeletonListRows rows={4} />
            ) : (
            <ul className="divide-y divide-gray-50">
              {activities.map((item, i) => {
                const ActivityIcon = item.icon
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

              {activities.length === 0 && (
                <li className="px-6 py-8 text-center text-sm text-gray-400">ยังไม่มีกิจกรรม</li>
              )}
            </ul>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
