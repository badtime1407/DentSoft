'use client'

import type { ReferenceDentist } from '@/app/admin/_mock/reference'
import type { BookingStatus, ScheduleAppointment } from '@/app/admin/appointments/mock-appointments'

const START_MIN = 8 * 60
const END_MIN = 19 * 60
const SLOT_MIN = 30
const ROW_HEIGHT = 40
const SLOT_COUNT = (END_MIN - START_MIN) / SLOT_MIN
const BOARD_HEIGHT = SLOT_COUNT * ROW_HEIGHT

const blockTone: Record<BookingStatus, string> = {
  PENDING: 'bg-amber-100 border border-amber-300 text-amber-800',
  CONFIRMED: 'bg-sky-100 border border-sky-300 text-sky-800',
  COMPLETED: 'bg-blue-100 border border-blue-300 text-blue-800',
  CANCELLED: 'bg-rose-50 border border-rose-200 text-rose-400 line-through',
}

function minutesToLabel(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function AppointmentScheduleBoard({
  dentists,
  appointments,
  serviceNameById,
  onSlotClick,
  onAppointmentClick,
}: {
  dentists: ReferenceDentist[]
  appointments: ScheduleAppointment[]
  serviceNameById: Record<string, string>
  onSlotClick: (dentistId: string, startTime: string) => void
  onAppointmentClick: (appointment: ScheduleAppointment) => void
}) {
  const timeLabels = Array.from({ length: SLOT_COUNT }, (_, i) => minutesToLabel(START_MIN + i * SLOT_MIN))

  function handleColumnClick(dentistId: string, e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const offsetY = e.clientY - rect.top
    const slotIndex = Math.round(offsetY / ROW_HEIGHT)
    const minutes = START_MIN + slotIndex * SLOT_MIN
    onSlotClick(dentistId, minutesToLabel(Math.min(Math.max(minutes, START_MIN), END_MIN - SLOT_MIN)))
  }

  return (
    <div className="overflow-auto max-h-[640px]">
      <div className="flex min-w-[640px]">
        {/* Time labels column */}
        <div className="w-14 shrink-0 sticky left-0 bg-white z-10">
          <div className="h-14 border-b border-gray-100 sticky top-0 bg-white z-10" />
          <div className="relative" style={{ height: BOARD_HEIGHT }}>
            {timeLabels.map((label, i) => (
              <p
                key={label}
                className="absolute right-2 -translate-y-1/2 text-[11px] text-gray-400 tabular-nums"
                style={{ top: i * ROW_HEIGHT }}
              >
                {label}
              </p>
            ))}
          </div>
        </div>

        {dentists.map((dentist) => {
          const offHoursStart = Math.min(Math.max(timeToMinutes(dentist.startTime) - START_MIN, 0), BOARD_HEIGHT)
          const offHoursEndTop = Math.min(Math.max(timeToMinutes(dentist.endTime) - START_MIN, 0), BOARD_HEIGHT)
          const columnAppointments = appointments.filter((a) => a.dentistId === dentist.id)

          return (
            <div key={dentist.id} className="flex-1 min-w-[180px] border-l border-gray-100">
              <div className="h-14 border-b border-gray-100 px-3 flex flex-col justify-center sticky top-0 bg-white z-10">
                <p className="text-sm font-medium text-gray-900 truncate">{dentist.name}</p>
                <p className="text-xs text-gray-400 truncate">{dentist.specialty}</p>
              </div>

              <div
                className="relative cursor-pointer"
                style={{ height: BOARD_HEIGHT }}
                onClick={(e) => handleColumnClick(dentist.id, e)}
              >
                {timeLabels.map((label, i) => (
                  <div key={label} className="absolute left-0 right-0 border-b border-gray-50" style={{ top: i * ROW_HEIGHT, height: ROW_HEIGHT }} />
                ))}

                {offHoursStart > 0 && (
                  <div className="absolute left-0 right-0 top-0 bg-slate-50/70 pointer-events-none" style={{ height: offHoursStart }} />
                )}
                {offHoursEndTop < BOARD_HEIGHT && (
                  <div
                    className="absolute left-0 right-0 bottom-0 bg-slate-50/70 pointer-events-none"
                    style={{ height: BOARD_HEIGHT - offHoursEndTop }}
                  />
                )}

                {columnAppointments.map((a) => {
                  const top = ((timeToMinutes(a.startTime) - START_MIN) / SLOT_MIN) * ROW_HEIGHT
                  const height = Math.max((a.durationMin / SLOT_MIN) * ROW_HEIGHT - 3, 26)
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onAppointmentClick(a)
                      }}
                      className={`absolute left-1 right-1 rounded-lg px-2 py-1 text-left text-xs leading-snug overflow-hidden transition-shadow hover:shadow-sm ${blockTone[a.status]}`}
                      style={{ top: top + 1, height }}
                    >
                      <span className="block font-medium truncate">{a.patientName}</span>
                      <span className="block truncate opacity-80">{serviceNameById[a.serviceId] ?? ''}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
