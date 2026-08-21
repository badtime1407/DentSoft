'use client'

import { IconChevronLeft, IconChevronRight } from '@/components/shared/icons'
import { focusRing } from '@/lib/shared/focus-ring'

const weekdayLabels = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา']

function toISODate(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

// วันจันทร์ = 0 ... วันอาทิตย์ = 6
function mondayIndex(jsDay: number): number {
  return (jsDay + 6) % 7
}

type CalendarCell = {
  iso: string
  day: number
  inCurrentMonth: boolean
}

function buildMonthGrid(year: number, month: number): CalendarCell[] {
  const firstOfMonth = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leading = mondayIndex(firstOfMonth.getDay())

  const cells: CalendarCell[] = []

  for (let i = leading; i > 0; i--) {
    const prevMonthDays = new Date(year, month, 0).getDate()
    const day = prevMonthDays - i + 1
    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    cells.push({ iso: toISODate(prevYear, prevMonth, day), day, inCurrentMonth: false })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ iso: toISODate(year, month, day), day, inCurrentMonth: true })
  }

  while (cells.length % 7 !== 0) {
    const day = cells.length - (leading + daysInMonth) + 1
    const nextMonth = month === 11 ? 0 : month + 1
    const nextYear = month === 11 ? year + 1 : year
    cells.push({ iso: toISODate(nextYear, nextMonth, day), day, inCurrentMonth: false })
  }

  return cells
}

export function AppointmentCalendar({
  viewYear,
  viewMonth,
  selectedDate,
  todayDate,
  appointmentDates,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  className = '',
}: {
  viewYear: number
  viewMonth: number
  selectedDate: string
  todayDate: string
  appointmentDates: Set<string>
  onSelectDate: (date: string) => void
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
  className?: string
}) {
  const cells = buildMonthGrid(viewYear, viewMonth)
  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 ${className}`}>
      {/* Month Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-900">{monthLabel}</h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrevMonth}
            aria-label="เดือนก่อนหน้า"
            className={`p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition ${focusRing}`}
          >
            <IconChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            aria-label="เดือนถัดไป"
            className={`p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition ${focusRing}`}
          >
            <IconChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Today Button */}
      <button
        type="button"
        onClick={onToday}
        className={`w-full mb-3 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition ${focusRing}`}
      >
        วันนี้
      </button>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekdayLabels.map((label) => (
          <div key={label} className="text-center text-xs font-semibold text-gray-400 py-1">
            {label}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell) => {
          const isToday = cell.iso === todayDate
          const isSelected = cell.iso === selectedDate
          const hasAppointments = appointmentDates.has(cell.iso)

          return (
            <button
              key={cell.iso}
              type="button"
              onClick={() => onSelectDate(cell.iso)}
              className={`relative aspect-square flex items-center justify-center rounded-lg text-xs sm:text-sm transition-all ${focusRing} ${
                isSelected
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : isToday
                    ? 'ring-2 ring-inset ring-blue-500 text-gray-900 font-medium bg-blue-50/50'
                    : cell.inCurrentMonth
                      ? 'text-gray-700 hover:bg-gray-50 font-medium'
                      : 'text-gray-300 hover:bg-gray-50'
              }`}
            >
              <span>{cell.day}</span>
              {hasAppointments && (
                <span
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                    isSelected ? 'bg-white' : 'bg-blue-500'
                  }`}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
