'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { useQueue } from '@/components/dentist/QueueProvider'
import { StatusBadge } from '@/components/shared/StatusBadge'
import {
  IconCalendar,
  IconClipboardList,
  IconRotate,
} from '@/components/shared/icons'
import { statusConfig } from '@/app/dentist/_mock/status'
import { currentDentist } from '@/app/dentist/_mock/reference'
import { MOCK_TODAY } from '@/app/dentist/_mock/appointments'
import { focusRing } from '@/lib/shared/focus-ring'

export default function DentistDashboard() {
  const { appointments, startTreatment } = useQueue()
  const router = useRouter()

  const todaysAppointments = useMemo(
    () => appointments.filter((a) => a.date === MOCK_TODAY),
    [appointments]
  )

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'สวัสดีตอนเช้า' : hour < 17 ? 'สวัสดีตอนบ่าย' : 'สวัสดีตอนเย็น'

  const waitingQueue = useMemo(
    () =>
      [...todaysAppointments]
        .filter((a) => a.status === 'WAITING')
        .sort((a, b) => (b.waitMinutes ?? 0) - (a.waitMinutes ?? 0)),
    [todaysAppointments]
  )

  // ยังไม่นับว่า "ถัดไป" เปลี่ยน จนกว่าคิวที่กำลังรักษาอยู่จะบันทึกการรักษาสำเร็จ (สถานะกลายเป็น COMPLETED)
  const nextPatient = useMemo(
    () =>
      [...todaysAppointments]
        .filter((a) => a.status === 'WAITING' || a.status === 'IN_TREATMENT')
        .sort((a, b) => a.time.localeCompare(b.time))[0],
    [todaysAppointments]
  )

  const totalFormatted = String(todaysAppointments.length).padStart(2, '0')
  const waitingFormatted = String(waitingQueue.length).padStart(2, '0')

  return (
    <div className="space-y-8 max-w-[1240px] mx-auto">
      {/* Greeting Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {greeting} {currentDentist.name}
        </h1>
        <p className="text-sm text-slate-500 mt-1.5 font-medium">
          วันนี้คุณมีการนัดหมายทั้งหมด {todaysAppointments.length} รายการ พร้อมเริ่มงานหรือยัง?
        </p>
      </div>

      {/* Top 3 Stat Cards Grid (Layout Inspired by Mockup) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Today Appointments */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <IconCalendar className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-slate-600 ml-3">วันนี้</span>
          </div>
          <div className="mt-5">
            <p className="text-4xl font-extrabold text-slate-900">{totalFormatted}</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">รายการนัดหมาย</p>
          </div>
        </div>

        {/* Card 2: Pending Action */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <IconClipboardList className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-slate-600 ml-3">รอดำเนินการ</span>
          </div>
          <div className="mt-5">
            <p className="text-4xl font-extrabold text-slate-900">{waitingFormatted}</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">คนไข้กำลังรอคิว</p>
          </div>
        </div>

        {/* Card 3: Featured Dark Blue Next Queue (display-only, not clickable) */}
        <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
              <IconRotate className="w-4.5 h-4.5" />
            </div>
            <span className="text-sm font-bold ml-3 text-white">คิวถัดไป</span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-white">
              {nextPatient ? `${nextPatient.time} น.` : 'ไม่มีคิวรอ'}
            </p>
            <p className="text-xs text-sky-100 mt-1 font-medium truncate">
              {nextPatient ? `คนไข้: ${nextPatient.patientName}` : 'ไม่มีคนไข้ในขณะนี้'}
            </p>
          </div>
        </div>
      </div>

      {/* Today's Appointment Table Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Table Title Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">ตารางนัดหมายวันนี้</h2>
          <Link
            href="/dentist/appointments"
            className={`text-sm font-bold text-blue-600 hover:underline ${focusRing}`}
          >
            ดูปฏิทินทั้งหมด
          </Link>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 text-center w-28">เวลา</th>
                <th className="py-4 px-6">คนไข้</th>
                <th className="py-4 px-6">การรักษา</th>
                <th className="py-4 px-6 text-center">สถานะ</th>
                <th className="py-4 px-6 text-center w-28">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {todaysAppointments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* เวลา */}
                  <td className="py-4 px-6 text-center font-bold text-blue-700 whitespace-nowrap">
                    {a.time} น.
                  </td>

                  {/* คนไข้ */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                        {a.patientName.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-800">{a.patientName}</span>
                    </div>
                  </td>

                  {/* การรักษา */}
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    {a.serviceName}
                  </td>

                  {/* สถานะ */}
                  <td className="py-4 px-6 text-center">
                    <StatusBadge
                      label={statusConfig[a.status].label}
                      tone={statusConfig[a.status].tone}
                    />
                  </td>

                  {/* การจัดการ */}
                  <td className="py-4 px-6 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => {
                        if (a.status === 'WAITING') {
                          startTreatment(a.id)
                        }
                        router.push(`/dentist/treatment?id=${a.id}`)
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 transition-all ${focusRing}`}
                    >
                      ดูบันทึกการรักษา
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
