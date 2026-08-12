'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/admin/PageHeader'
import { SearchBar } from '@/components/admin/SearchBar'
import { StatusBadge, type StatusTone } from '@/components/admin/StatusBadge'
import { StatCard } from '@/components/admin/StatCard'
import { AppointmentScheduleBoard } from '@/components/admin/AppointmentScheduleBoard'
import { AppointmentDrawer, type AppointmentFormValues } from '@/components/admin/AppointmentDrawer'
import { useCancelRequests } from '@/components/admin/CancelRequestsProvider'
import { IconCalendar, IconClock, IconXCircle, IconChevronLeft, IconChevronRight, IconPlus } from '@/components/admin/icons'
import { dentists, services } from '@/app/admin/_mock/reference'
import { addDays, buildMockAppointments, toISODate, type BookingStatus, type ScheduleAppointment } from './mock-appointments'
import { focusRing } from '@/lib/admin/focus-ring'

const statusConfig: Record<BookingStatus, { label: string; tone: StatusTone }> = {
  PENDING: { label: 'รอยืนยัน', tone: 'amber' },
  CONFIRMED: { label: 'ยืนยันแล้ว', tone: 'sky' },
  COMPLETED: { label: 'เสร็จสิ้น', tone: 'blue' },
  CANCELLED: { label: 'ยกเลิก', tone: 'rose' },
}

const statusFilterTabs: { id: 'ALL' | BookingStatus; label: string }[] = [
  { id: 'ALL', label: 'ทั้งหมด' },
  { id: 'PENDING', label: 'รอยืนยัน' },
  { id: 'CONFIRMED', label: 'ยืนยันแล้ว' },
  { id: 'COMPLETED', label: 'เสร็จสิ้น' },
  { id: 'CANCELLED', label: 'ยกเลิก' },
]

const dayLabels = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']

function startOfWeek(date: Date): Date {
  const mondayIndex = (date.getDay() + 6) % 7
  return addDays(date, -mondayIndex)
}

type DrawerState =
  | { open: false }
  | { open: true; mode: 'create'; defaults: { date: string; dentistId?: string; startTime?: string } }
  | { open: true; mode: 'edit'; appointment: ScheduleAppointment }

export default function AdminAppointments() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { requests, resolveRequestByAppointment } = useCancelRequests()

  const [appointments, setAppointments] = useState<ScheduleAppointment[]>(() => buildMockAppointments())
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState(() => toISODate(new Date()))
  const [viewMode, setViewMode] = useState<'board' | 'agenda'>('board')
  const [searchTerm, setSearchTerm] = useState('')
  const [dentistFilter, setDentistFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState<'ALL' | BookingStatus>('ALL')
  const [drawer, setDrawer] = useState<DrawerState>({ open: false })

  const serviceNameById = useMemo(() => Object.fromEntries(services.map((s) => [s.id, s.name])), [])
  const dentistNameById = useMemo(() => Object.fromEntries(dentists.map((d) => [d.id, d.name])), [])

  useEffect(() => {
    const requestId = searchParams.get('requestId')
    if (!requestId) return
    const appointment = appointments.find((a) => a.id === requestId)
    if (appointment) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reacting to an external navigation signal (notification click), not derivable render state
      setSelectedDate(appointment.date)
      setDrawer({ open: true, mode: 'edit', appointment })
    }
    router.replace('/admin/appointments')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const activeCancelRequest =
    drawer.open && drawer.mode === 'edit'
      ? requests.find((r) => r.appointmentId === drawer.appointment.id)
      : undefined

  const weekDates = useMemo(() => {
    const start = startOfWeek(addDays(new Date(), weekOffset * 7))
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }, [weekOffset])

  const dateAppointments = useMemo(
    () => appointments.filter((a) => a.date === selectedDate),
    [appointments, selectedDate]
  )

  const filteredAppointments = useMemo(() => {
    return dateAppointments.filter((a) => {
      if (statusFilter !== 'ALL' && a.status !== statusFilter) return false
      if (dentistFilter !== 'ALL' && a.dentistId !== dentistFilter) return false
      if (searchTerm.trim() && !a.patientName.toLowerCase().includes(searchTerm.trim().toLowerCase())) return false
      return true
    })
  }, [dateAppointments, statusFilter, dentistFilter, searchTerm])

  const pendingQueue = useMemo(
    () =>
      [...appointments]
        .filter((a) => a.status === 'PENDING')
        .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime)),
    [appointments]
  )

  const selectedDateLabel = new Date(selectedDate + 'T00:00:00').toLocaleDateString('th-TH', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  function confirmAppointment(id: string) {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'CONFIRMED' } : a)))
  }

  function declineAppointment(id: string) {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'CANCELLED' } : a)))
  }

  function cancelAppointment(id: string) {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'CANCELLED' } : a)))
    resolveRequestByAppointment(id)
    setDrawer({ open: false })
  }

  function handleSubmit(values: AppointmentFormValues) {
    const service = services.find((s) => s.id === values.serviceId)
    if (drawer.open && drawer.mode === 'edit') {
      const id = drawer.appointment.id
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, ...values, durationMin: service?.durationMin ?? a.durationMin }
            : a
        )
      )
      resolveRequestByAppointment(id)
    } else {
      setAppointments((prev) => [
        ...prev,
        {
          id: `ap-${Date.now()}`,
          ...values,
          durationMin: service?.durationMin ?? 30,
          status: 'CONFIRMED',
          source: 'PHONE',
        },
      ])
    }
    setDrawer({ open: false })
  }

  return (
    <>
      <PageHeader
        title="ตารางนัดหมาย"
        subtitle={selectedDateLabel}
        actions={
          <button
            type="button"
            onClick={() => setDrawer({ open: true, mode: 'create', defaults: { date: selectedDate } })}
            className={`flex items-center gap-2 px-3.5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 ${focusRing}`}
          >
            <IconPlus className="w-4 h-4" />
            เพิ่มนัดหมาย
          </button>
        }
      />

      {/* Date strip */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 mb-6 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setWeekOffset((w) => w - 1)}
          className={`p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition ${focusRing}`}
        >
          <IconChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 grid grid-cols-7 gap-1.5">
          {weekDates.map((date) => {
            const iso = toISODate(date)
            const active = iso === selectedDate
            const hasBookings = appointments.some((a) => a.date === iso)
            return (
              <button
                key={iso}
                type="button"
                onClick={() => setSelectedDate(iso)}
                className={`flex flex-col items-center gap-0.5 py-2 rounded-xl text-sm transition-all ${focusRing} ${
                  active ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className={`text-[11px] ${active ? 'text-blue-400' : 'text-gray-400'}`}>{dayLabels[date.getDay()]}</span>
                <span className="tabular-nums">{date.getDate()}</span>
                <span className={`w-1 h-1 rounded-full ${hasBookings ? 'bg-blue-500' : 'bg-transparent'}`} />
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => setWeekOffset((w) => w + 1)}
          className={`p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition ${focusRing}`}
        >
          <IconChevronRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            setWeekOffset(0)
            setSelectedDate(toISODate(new Date()))
          }}
          className={`ml-1 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 transition ${focusRing}`}
        >
          วันนี้
        </button>
      </div>

      {/* Pending confirmations */}
      {pendingQueue.length > 0 && (
        <div className="bg-amber-50/60 border border-amber-200 rounded-2xl mb-6 overflow-hidden">
          <div className="px-6 py-3 border-b border-amber-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-amber-800">รอยืนยันนัดหมาย (จองออนไลน์)</p>
            <span className="text-xs font-medium text-amber-700 bg-white px-2.5 py-1 rounded-full ring-1 ring-inset ring-amber-200">
              {pendingQueue.length} รายการ
            </span>
          </div>
          <ul className="divide-y divide-amber-100">
            {pendingQueue.slice(0, 5).map((a) => (
              <li key={a.id} className="px-6 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{a.patientName}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {new Date(a.date + 'T00:00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} · {a.startTime} น. · {serviceNameById[a.serviceId]} · {dentistNameById[a.dentistId]}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => confirmAppointment(a.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition ${focusRing}`}
                  >
                    ยืนยัน
                  </button>
                  <button
                    type="button"
                    onClick={() => declineAppointment(a.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium text-rose-500 border border-rose-200 hover:bg-rose-50 transition ${focusRing}`}
                  >
                    ปฏิเสธ
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-gray-900">ตารางเวลา</h2>
                <p className="text-xs text-gray-400 mt-0.5">Schedule board</p>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setViewMode('board')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${focusRing} ${
                    viewMode === 'board' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  ตารางเวลา
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('agenda')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${focusRing} ${
                    viewMode === 'agenda' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  รายการ
                </button>
              </div>
            </div>

            {viewMode === 'board' ? (
              <AppointmentScheduleBoard
                dentists={dentists}
                appointments={filteredAppointments}
                serviceNameById={serviceNameById}
                onSlotClick={(dentistId, startTime) => setDrawer({ open: true, mode: 'create', defaults: { date: selectedDate, dentistId, startTime } })}
                onAppointmentClick={(appointment) => setDrawer({ open: true, mode: 'edit', appointment })}
              />
            ) : (
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
                    {filteredAppointments
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((a) => (
                        <tr key={a.id} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4 font-mono font-medium text-gray-900 tabular-nums">{a.startTime}</td>
                          <td className="px-6 py-4 text-gray-800">{a.patientName}</td>
                          <td className="px-6 py-4 text-gray-600">{serviceNameById[a.serviceId]}</td>
                          <td className="px-6 py-4 text-gray-600">{dentistNameById[a.dentistId]}</td>
                          <td className="px-6 py-4">
                            <StatusBadge label={statusConfig[a.status].label} tone={statusConfig[a.status].tone} />
                          </td>
                          <td className="px-6 py-4">
                            <button
                              type="button"
                              onClick={() => setDrawer({ open: true, mode: 'edit', appointment: a })}
                              className={`text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs font-medium transition px-2 py-1.5 rounded-md ${focusRing}`}
                            >
                              แก้ไข
                            </button>
                          </td>
                        </tr>
                      ))}
                    {filteredAppointments.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">ไม่มีนัดหมายตรงกับเงื่อนไข</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
            <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="ค้นหาชื่อคนไข้..." className="w-full" />
            <select
              value={dentistFilter}
              onChange={(e) => setDentistFilter(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 transition-all ${focusRing}`}
            >
              <option value="ALL">ทันตแพทย์ทั้งหมด</option>
              {dentists.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-1.5">
              {statusFilterTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${focusRing} ${
                    statusFilter === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-500 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <StatCard label="นัดวันนี้" value={dateAppointments.length} icon={IconCalendar} />
            <StatCard label="รอยืนยัน" value={dateAppointments.filter((a) => a.status === 'PENDING').length} icon={IconClock} />
            <StatCard label="ยกเลิก" value={dateAppointments.filter((a) => a.status === 'CANCELLED').length} icon={IconXCircle} />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">ทันตแพทย์</h2>
              <p className="text-xs text-gray-400 mt-0.5">สำหรับวันที่เลือก</p>
            </div>
            <ul className="divide-y divide-gray-50">
              {dentists.map((d) => (
                <li key={d.id} className="px-6 py-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{d.name}</p>
                    <p className="text-xs text-gray-400 truncate">{d.startTime} - {d.endTime} น.</p>
                  </div>
                  <span className="text-xs text-gray-500 shrink-0">
                    {dateAppointments.filter((a) => a.dentistId === d.id && a.status !== 'CANCELLED').length} คิว
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <AppointmentDrawer
        open={drawer.open}
        mode={drawer.open ? drawer.mode : 'create'}
        appointment={drawer.open && drawer.mode === 'edit' ? drawer.appointment : undefined}
        defaults={drawer.open && drawer.mode === 'create' ? drawer.defaults : { date: selectedDate }}
        allDentists={dentists}
        cancelRequest={activeCancelRequest}
        onClose={() => setDrawer({ open: false })}
        onSubmit={handleSubmit}
        onConfirm={
          drawer.open && drawer.mode === 'edit'
            ? () => {
                confirmAppointment(drawer.appointment.id)
                setDrawer({ open: false })
              }
            : undefined
        }
        onCancelAppointment={drawer.open && drawer.mode === 'edit' ? () => cancelAppointment(drawer.appointment.id) : undefined}
      />
    </>
  )
}
