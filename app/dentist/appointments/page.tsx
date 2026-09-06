'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useQueue } from '@/components/dentist/QueueProvider'
import { PageHeader } from '@/components/shared/PageHeader'
import { AppointmentCalendar } from '@/components/dentist/AppointmentCalendar'
import { DailyAppointmentList } from '@/components/dentist/DailyAppointmentList'
import { SkeletonListRows } from '@/components/shared/Skeleton'
import type { DentistAppointment } from '@/components/dentist/types'

function todayInBangkok() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Bangkok' })
}

const TODAY = todayInBangkok()
const [todayYearStr, todayMonthStr] = TODAY.split('-')
const todayYear = Number(todayYearStr)
const todayMonth = Number(todayMonthStr) - 1

function shiftMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const total = month + delta
  const newYear = year + Math.floor(total / 12)
  const newMonth = ((total % 12) + 12) % 12
  return { year: newYear, month: newMonth }
}

export default function DentistAppointments() {
  const { appointments, isLoading, startTreatment } = useQueue()
  const router = useRouter()

  const [viewYear, setViewYear] = useState(todayYear)
  const [viewMonth, setViewMonth] = useState(todayMonth)
  const [selectedDate, setSelectedDate] = useState(TODAY)

  const appointmentDates = useMemo(() => new Set(appointments.map((a) => a.date)), [appointments])

  const dayAppointments = useMemo(
    () => appointments.filter((a) => a.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time)),
    [appointments, selectedDate]
  )

  const isToday = selectedDate === TODAY
  const highlightId = useMemo(() => {
    if (!isToday) return undefined
    return (
      dayAppointments.find((a) => a.status === 'IN_TREATMENT')?.id ??
      dayAppointments.find((a) => a.status === 'WAITING')?.id ??
      dayAppointments.find((a) => a.status === 'CONFIRMED')?.id
    )
  }, [isToday, dayAppointments])

  const selectedDateLabel = new Date(`${selectedDate}T00:00:00`).toLocaleDateString('th-TH', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  function handleSelectDate(iso: string) {
    setSelectedDate(iso)
    const [y, m] = iso.split('-').map(Number)
    setViewYear(y)
    setViewMonth(m - 1)
  }

  function handleToday() {
    setSelectedDate(TODAY)
    setViewYear(todayYear)
    setViewMonth(todayMonth)
  }

  function handlePrevMonth() {
    const { year, month } = shiftMonth(viewYear, viewMonth, -1)
    setViewYear(year)
    setViewMonth(month)
  }

  function handleNextMonth() {
    const { year, month } = shiftMonth(viewYear, viewMonth, 1)
    setViewYear(year)
    setViewMonth(month)
  }

  function handleOpen(appointment: DentistAppointment) {
    const isAppointmentToday = appointment.date === TODAY
    if (isAppointmentToday && (appointment.status === 'CONFIRMED' || appointment.status === 'WAITING')) {
      startTreatment(appointment.id)
    }
    router.push(`/dentist/treatment?id=${appointment.id}`)
  }

  return (
    <>
      <PageHeader title="นัดหมาย" subtitle="เลือกวันที่จากปฏิทินเพื่อดูตารางนัดหมายและรายชื่อคนไข้" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ฝั่งซ้าย: ปฏิทินนัดหมาย (ปรับความยาวให้สูงโปร่งขึ้น) */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col">
          <AppointmentCalendar
            viewYear={viewYear}
            viewMonth={viewMonth}
            selectedDate={selectedDate}
            todayDate={TODAY}
            appointmentDates={appointmentDates}
            onSelectDate={handleSelectDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
            className="h-[520px] flex flex-col justify-between"
          />
        </div>

        {/* ฝั่งขวา: รายชื่อคนไข้ที่นัดหมาย (ปรับความยาวสูง 520px เท่ากันกับปฏิทิน) */}
        <div className="lg:col-span-7 xl:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col h-[520px]">
          <div className="mb-4 pb-3 border-b border-gray-100 shrink-0">
            <h2 className="text-base font-bold text-gray-900">
              {selectedDateLabel} {isToday && <span className="text-blue-600 font-semibold ml-1">· วันนี้</span>}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              รายชื่อคนไข้ที่นัดหมาย ({dayAppointments.length} รายการ)
            </p>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 pr-1">
            {isLoading ? (
              <SkeletonListRows rows={4} />
            ) : (
              <DailyAppointmentList appointments={dayAppointments} highlightId={highlightId} onOpen={handleOpen} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
