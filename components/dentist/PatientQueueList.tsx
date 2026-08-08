import Link from 'next/link'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { DentistAppointment } from '@/app/dentist/_mock/appointments'
import { statusConfig } from '@/app/dentist/_mock/status'

export function PatientQueueList({
  appointments,
  selectedId,
}: {
  appointments: DentistAppointment[]
  selectedId: string
}) {
  return (
    <ul className="divide-y divide-gray-50 max-h-[calc(100vh-13rem)] overflow-y-auto">
      {appointments.map((a) => {
        const active = a.id === selectedId
        return (
          <li key={a.id}>
            <Link
              href={`?id=${a.id}`}
              scroll={false}
              className={`flex items-center gap-3 px-4 py-3 transition ${
                active ? 'bg-teal-50 border-l-4 border-teal-600' : 'border-l-4 border-transparent hover:bg-slate-50'
              } ${a.status === 'CANCELLED' ? 'opacity-50' : ''}`}
            >
              <span className="w-12 shrink-0 font-mono text-xs font-semibold text-gray-700 tabular-nums">{a.time}</span>
              <div className="min-w-0 flex-1">
                <p className={`text-sm truncate ${active ? 'font-semibold text-gray-900' : 'font-medium text-gray-800'}`}>{a.patientName}</p>
                <p className="text-xs text-gray-400 truncate">{a.serviceName}</p>
              </div>
              <StatusBadge label={statusConfig[a.status].label} tone={statusConfig[a.status].tone} dot={false} />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
