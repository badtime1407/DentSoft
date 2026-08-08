'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { useQueue } from '@/components/dentist/QueueProvider'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { IconCalendar, IconClock, IconPulse, IconCheckCircle, IconAlertTriangle, IconClipboardList } from '@/components/shared/icons'
import { statusConfig, urgencyConfig, urgencyOf } from '@/app/dentist/_mock/status'
import { currentDentist } from '@/app/dentist/_mock/reference'
import { MOCK_TODAY } from '@/app/dentist/_mock/appointments'
import { focusRing } from '@/lib/shared/focus-ring'

export default function DentistDashboard() {
  const { appointments, startTreatment } = useQueue()
  const router = useRouter()

  const todaysAppointments = useMemo(() => appointments.filter((a) => a.date === MOCK_TODAY), [appointments])

  const today = new Date().toLocaleDateString('th-TH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'สวัสดีตอนเช้า' : hour < 17 ? 'สวัสดีตอนบ่าย' : 'สวัสดีตอนเย็น'

  const counts = useMemo(() => ({
    total: todaysAppointments.length,
    waiting: todaysAppointments.filter((a) => a.status === 'WAITING').length,
    inTreatment: todaysAppointments.filter((a) => a.status === 'IN_TREATMENT').length,
    completed: todaysAppointments.filter((a) => a.status === 'COMPLETED').length,
  }), [todaysAppointments])

  const waitingQueue = useMemo(
    () => [...todaysAppointments].filter((a) => a.status === 'WAITING').sort((a, b) => (b.waitMinutes ?? 0) - (a.waitMinutes ?? 0)),
    [todaysAppointments]
  )
  const nextPatient = waitingQueue[0]
  const nextUrgency = nextPatient ? urgencyOf(nextPatient.waitMinutes ?? 0) : 'NORMAL'
  const currentTreatment = todaysAppointments.find((a) => a.status === 'IN_TREATMENT')

  const alerts = [
    ...(nextUrgency === 'URGENT' && nextPatient ? [`${nextPatient.patientName} รอคิวมานาน ${nextPatient.waitMinutes} นาทีแล้ว`] : []),
    ...(nextPatient?.note ? [`หมายเหตุคิวถัดไป: ${nextPatient.note}`] : []),
  ]

  return (
    <>
      <PageHeader
        eyebrow={`${greeting} ${currentDentist.name}`}
        title="ภาพรวมวันนี้"
        subtitle={today}
        actions={
          <>
            <Link
              href="/dentist/appointments"
              className={`flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-teal-300 hover:text-teal-700 hover:bg-teal-50/50 transition-all ${focusRing}`}
            >
              <IconCalendar className="w-4 h-4" />
              ดูตารางนัดหมาย
            </Link>
            <Link
              href="/dentist/treatment"
              className={`flex items-center gap-2 px-3.5 py-2 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-all shadow-sm shadow-teal-200 ${focusRing}`}
            >
              <IconClipboardList className="w-4 h-4" />
              บันทึกการรักษา
            </Link>
          </>
        }
      />

      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {alerts.map((text, i) => (
            <div key={i} className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-50 border border-rose-100 text-sm text-rose-700">
              <IconAlertTriangle className="w-4 h-4 shrink-0" />
              {text}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="นัดหมายวันนี้" value={counts.total} icon={IconCalendar} tone="teal" />
        <StatCard label="กำลังรอคิว" value={counts.waiting} sub={nextPatient ? `รอนานสุด ${nextPatient.waitMinutes} นาที` : 'ไม่มีคนไข้รอ'} icon={IconClock} tone="teal" />
        <StatCard label="กำลังรักษา" value={counts.inTreatment} icon={IconPulse} tone="teal" />
        <StatCard label="เสร็จสิ้นแล้ว" value={counts.completed} sub={`จาก ${counts.total} นัดวันนี้`} icon={IconCheckCircle} tone="teal" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Next patient */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">คิวถัดไป</h2>
              <p className="text-xs text-gray-400 mt-0.5">Next patient</p>
            </div>
            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full ring-1 ring-inset ring-amber-200">
              {waitingQueue.length} คนกำลังรอ
            </span>
          </div>

          {nextPatient ? (
            <div className={`px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${nextUrgency === 'URGENT' ? 'bg-rose-50/60' : 'bg-teal-50/40'}`}>
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center text-lg font-semibold shrink-0">
                  {nextPatient.patientName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900 truncate">{nextPatient.patientName}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${urgencyConfig[nextUrgency].badge}`}>
                      {urgencyConfig[nextUrgency].label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5 truncate">{nextPatient.serviceName} · {nextPatient.durationMin} นาที</p>
                  <p className={`text-xs font-medium mt-1 ${urgencyConfig[nextUrgency].text}`}>รอมาแล้ว {nextPatient.waitMinutes} นาที</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  startTreatment(nextPatient.id)
                  router.push(`/dentist/treatment?id=${nextPatient.id}`)
                }}
                className={`px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-all shadow-sm shadow-teal-200 shrink-0 text-center ${focusRing}`}
              >
                เริ่มรักษา
              </button>
            </div>
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-gray-400">ไม่มีคนไข้รอคิวในขณะนี้</p>
            </div>
          )}
        </div>

        {/* Current treatment */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">กำลังรักษา</h2>
            <p className="text-xs text-gray-400 mt-0.5">Current treatment</p>
          </div>

          {currentTreatment ? (
            <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-teal-50/40">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-lg font-semibold shrink-0">
                  {currentTreatment.patientName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{currentTreatment.patientName}</p>
                  <p className="text-sm text-gray-500 mt-0.5 truncate">{currentTreatment.serviceName}</p>
                  <p className="text-xs text-gray-400 mt-1">เริ่ม {currentTreatment.time} น.</p>
                </div>
              </div>
              <Link
                href={`/dentist/treatment?id=${currentTreatment.id}`}
                className={`px-5 py-2.5 bg-white border border-teal-200 text-teal-700 rounded-xl text-sm font-medium hover:bg-teal-50 transition-all shrink-0 text-center ${focusRing}`}
              >
                บันทึกการรักษา
              </Link>
            </div>
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-gray-400">ไม่มีคนไข้ในห้องตรวจขณะนี้</p>
            </div>
          )}
        </div>
      </div>

      {/* Today's timeline */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">ตารางนัดหมายวันนี้</h2>
          <p className="text-xs text-gray-400 mt-0.5">Today&apos;s timeline</p>
        </div>
        <ul className="divide-y divide-gray-50">
          {todaysAppointments.map((a) => (
            <li key={a.id}>
              <Link
                href={`/dentist/treatment?id=${a.id}`}
                className={`flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition ${focusRing}`}
              >
                <span className="w-14 shrink-0 font-mono text-sm font-medium text-gray-900 tabular-nums">{a.time}</span>
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-semibold shrink-0">
                  {a.patientName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 truncate">{a.patientName}</p>
                  <p className="text-xs text-gray-400 truncate">{a.serviceName}</p>
                </div>
                <StatusBadge label={statusConfig[a.status].label} tone={statusConfig[a.status].tone} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
