'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useQueue } from '@/components/dentist/QueueProvider'
import { PageHeader } from '@/components/shared/PageHeader'
import { AppointmentCalendar } from '@/components/dentist/AppointmentCalendar'
import { DailyAppointmentList } from '@/components/dentist/DailyAppointmentList'
import { MOCK_TODAY, type DentistAppointment } from '@/app/dentist/_mock/appointments'

const [todayYearStr, todayMonthStr] = MOCK_TODAY.split('-')
const todayYear = Number(todayYearStr)
const todayMonth = Number(todayMonthStr) - 1

function shiftMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const total = month + delta
  const newYear = year + Math.floor(total / 12)
  const newMonth = ((total % 12) + 12) % 12
  return { year: newYear, month: newMonth }
}

export default function DentistAppointments() {
  const { appointments, startTreatment } = useQueue()
  const router = useRouter()

  const [viewYear, setViewYear] = useState(todayYear)
  const [viewMonth, setViewMonth] = useState(todayMonth)
  const [selectedDate, setSelectedDate] = useState(MOCK_TODAY)

  const appointmentDates = useMemo(() => new Set(appointments.map((a) => a.date)), [appointments])

  const dayAppointments = useMemo(
    () => appointments.filter((a) => a.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time)),
    [appointments, selectedDate]
  )

  const isToday = selectedDate === MOCK_TODAY
  const highlightId = useMemo(() => {
    if (!isToday) return undefined
    return (
      dayAppointments.find((a) => a.status === 'IN_TREATMENT')?.id ??
      dayAppointments.find((a) => a.status === 'WAITING')?.id
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
    setSelectedDate(MOCK_TODAY)
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
    if (appointment.status === 'WAITING') {
      startTreatment(appointment.id)
    }
    router.push(`/dentist/treatment?id=${appointment.id}`)
  }

  return (
    <>
      <PageHeader title="นัดหมาย" subtitle="เลือกวันที่จากปฏิทินเพื่อดูตารางนัดหมาย" />

      <div className="max-w-md mb-6">
        <AppointmentCalendar
          viewYear={viewYear}
          viewMonth={viewMonth}
          selectedDate={selectedDate}
          todayDate={MOCK_TODAY}
          appointmentDates={appointmentDates}
          onSelectDate={handleSelectDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
        />
      </div>

      <div>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900">
            {selectedDateLabel} {isToday && <span className="text-teal-600 font-medium">· วันนี้</span>}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">{dayAppointments.length} นัดหมาย</p>
        </div>

        <DailyAppointmentList appointments={dayAppointments} highlightId={highlightId} onOpen={handleOpen} />
      </div>
    </>
  )
}
