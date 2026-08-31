'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useQueue } from '@/components/dentist/QueueProvider'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import {
  IconCalendar,
  IconClipboardList,
  IconRotate,
} from '@/components/shared/icons'
import { statusConfig } from '@/lib/dentist/status-config'
import { focusRing } from '@/lib/shared/focus-ring'

function todayInBangkok() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Bangkok' })
}

export default function DentistDashboard() {
  const { appointments, isLoading, startTreatment } = useQueue()
  const router = useRouter()
  const [dentistName, setDentistName] = useState('')

  useEffect(() => {
    fetch('/api/dentist/me')
      .then((res) => res.json())
      .then((data: { name?: string }) => setDentistName(data.name ?? ''))
  }, [])

  const today = useMemo(() => todayInBangkok(), [])

  const todaysAppointments = useMemo(
    () => appointments.filter((a) => a.date === today),
    [appointments, today]
  )

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'สวัสดีตอนเช้า' : hour < 17 ? 'สวัสดีตอนบ่าย' : 'สวัสดีตอนเย็น'

  const pendingQueue = useMemo(
    () =>
      [...todaysAppointments]
        .filter((a) => a.status === 'CONFIRMED' || a.status === 'WAITING')
        .sort((a, b) => a.time.localeCompare(b.time)),
    [todaysAppointments]
  )

  // ยังไม่นับว่า "ถัดไป" เปลี่ยน จนกว่าคิวที่กำลังรักษาอยู่จะบันทึกการรักษาสำเร็จ (สถานะกลายเป็น COMPLETED)
  const nextPatient = useMemo(
    () =>
      [...todaysAppointments]
        .filter((a) => a.status === 'CONFIRMED' || a.status === 'WAITING' || a.status === 'IN_TREATMENT')
        .sort((a, b) => a.time.localeCompare(b.time))[0],
    [todaysAppointments]
  )

  const totalFormatted = String(todaysAppointments.length).padStart(2, '0')
  const waitingFormatted = String(pendingQueue.length).padStart(2, '0')

  return (
    <>
      <PageHeader
        eyebrow={dentistName ? `${greeting} ${dentistName}` : greeting}
        title="ภาพรวมงานวันนี้"
        subtitle={`วันนี้คุณมีการนัดหมายทั้งหมด ${todaysAppointments.length} รายการ พร้อมเริ่มงานหรือยัง?`}
        actions={
          <Link
            href="/dentist/appointments"
            className={`flex items-center gap-2 px-3.5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 ${focusRing}`}
          >
            <IconClipboardList className="w-4 h-4" />
            ดูปฏิทินทั้งหมด
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="วันนี้" value={totalFormatted} sub="รายการนัดหมาย" icon={IconCalendar} />
        <StatCard label="รอดำเนินการ" value={waitingFormatted} sub="คนไข้กำลังรอคิว" icon={IconClipboardList} />

        {/* Featured card: next patient in queue — kept visually distinct since it has no admin equivalent */}
        <div className="rounded-2xl p-5 bg-blue-600 text-white shadow-sm flex flex-col">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-white/20 text-white">
            <IconRotate className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold tabular-nums tracking-tight text-white">
            {nextPatient ? `${nextPatient.time} น.` : 'ไม่มีคิวรอ'}
          </p>
          <p className="text-xs mt-1 font-medium text-sky-100">คิวถัดไป</p>
          <p className="text-xs mt-0.5 text-sky-100 truncate">
            {nextPatient ? `คนไข้: ${nextPatient.patientName}` : 'ไม่มีคนไข้ในขณะนี้'}
          </p>
        </div>
      </div>

      {/* Today's appointment table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">ตารางนัดหมายวันนี้</h2>
            <p className="text-xs text-gray-400 mt-0.5">Today&apos;s schedule</p>
          </div>
          <Link
            href="/dentist/appointments"
            className={`text-xs font-medium text-blue-600 hover:underline ${focusRing}`}
          >
            ดูปฏิทินทั้งหมด
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50">
                <th className="px-6 py-3 font-medium">เวลา</th>
                <th className="px-6 py-3 font-medium">คนไข้</th>
                <th className="px-6 py-3 font-medium">การรักษา</th>
                <th className="px-6 py-3 font-medium">สถานะ</th>
                <th className="px-6 py-3 font-medium">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {todaysAppointments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-mono font-medium text-gray-900 tabular-nums">{a.time} น.</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-semibold">
                        {a.patientName.charAt(0)}
                      </div>
                      <span className="text-gray-800">{a.patientName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{a.serviceName}</td>
                  <td className="px-6 py-4">
                    <StatusBadge label={statusConfig[a.status].label} tone={statusConfig[a.status].tone} />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (a.status === 'CONFIRMED' || a.status === 'WAITING') {
                          startTreatment(a.id)
                        }
                        router.push(`/dentist/treatment?id=${a.id}`)
                      }}
                      className={`inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs font-medium transition px-2 py-1.5 rounded-md ${focusRing}`}
                    >
                      ดูบันทึกการรักษา
                    </button>
                  </td>
                </tr>
              ))}

              {!isLoading && todaysAppointments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">
                    ไม่มีนัดหมายวันนี้
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
