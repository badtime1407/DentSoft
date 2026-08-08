import { StatusBadge } from '@/components/shared/StatusBadge'
import { focusRing } from '@/lib/shared/focus-ring'
import type { DentistAppointment } from '@/app/dentist/_mock/appointments'
import { statusConfig } from '@/app/dentist/_mock/status'

const actionLabel: Record<DentistAppointment['status'], string> = {
  WAITING: 'เริ่มรักษา',
  IN_TREATMENT: 'บันทึกการรักษา',
  COMPLETED: 'ดูบันทึก',
  CONFIRMED: 'ดูรายละเอียด',
  CANCELLED: 'ดูรายละเอียด',
}

export function DailyAppointmentList({
  appointments,
  highlightId,
  onOpen,
}: {
  appointments: DentistAppointment[]
  highlightId?: string
  onOpen: (appointment: DentistAppointment) => void
}) {
  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
        <p className="text-sm text-gray-400">ไม่มีนัดหมายในวันนี้</p>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {appointments.map((a) => {
        const isHighlight = a.id === highlightId
        const isCancelled = a.status === 'CANCELLED'

        return (
          <li
            key={a.id}
            className={`rounded-2xl border shadow-sm transition-all ${
              isHighlight ? 'bg-teal-50/60 border-teal-200' : 'bg-white border-gray-100'
            } ${isCancelled ? 'opacity-60' : ''}`}
          >
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="w-16 shrink-0">
                <p className={`font-mono font-semibold tabular-nums ${isHighlight ? 'text-teal-700 text-lg' : 'text-gray-900 text-base'}`}>{a.time}</p>
                <p className="text-xs text-gray-400">{a.durationMin} นาที</p>
              </div>

              <div className={`rounded-xl flex items-center justify-center font-semibold shrink-0 ${
                isHighlight ? 'w-12 h-12 bg-teal-600 text-white text-lg' : 'w-10 h-10 bg-slate-100 text-slate-600 text-sm'
              }`}>
                {a.patientName.charAt(0)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">{a.patientName}</p>
                <p className="text-xs text-gray-500 truncate">{a.serviceName}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge label={statusConfig[a.status].label} tone={statusConfig[a.status].tone} />
                <button
                  type="button"
                  onClick={() => onOpen(a)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${focusRing} ${
                    a.status === 'WAITING'
                      ? 'bg-teal-600 text-white hover:bg-teal-700'
                      : a.status === 'IN_TREATMENT'
                        ? 'bg-white border border-teal-200 text-teal-700 hover:bg-teal-50'
                        : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {actionLabel[a.status]}
                </button>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
