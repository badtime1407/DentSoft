'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PatientHeader } from '@/components/patient/PatientHeader'
import { PatientFooter } from '@/components/patient/PatientFooter'
import {
  IconCalendar,
  IconClock,
  IconTooth,
  IconHeadset,
} from '@/components/shared/icons'
import { focusRing } from '@/lib/shared/focus-ring'
import { SkeletonDetailPanel, SkeletonTableRows } from '@/components/shared/Skeleton'

type Appointment = {
  id: string
  date: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  requestType: 'CANCEL' | 'RESCHEDULE' | null
  service: { name: string }
  dentist: { title: string; firstName: string; lastName: string } | null
}

const statusLabel: Record<Appointment['status'], { label: string; style: string }> = {
  PENDING: { label: 'รอยืนยัน', style: 'bg-amber-50 text-amber-600' },
  CONFIRMED: { label: 'ยืนยันแล้ว', style: 'bg-sky-50 text-sky-600' },
  COMPLETED: { label: 'เสร็จสิ้น', style: 'bg-emerald-50 text-emerald-600' },
  CANCELLED: { label: 'ยกเลิก', style: 'bg-rose-50 text-rose-500' },
}

function formatDentist(dentist: Appointment['dentist']) {
  return dentist ? `${dentist.title} ${dentist.firstName} ${dentist.lastName}` : 'ยังไม่มอบหมายทันตแพทย์'
}

export default function PatientHistoryPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [requestModal, setRequestModal] = useState<{ id: string; type: 'CANCEL' | 'RESCHEDULE' } | null>(null)
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    fetch('/api/appointments')
      .then((res) => res.json())
      .then((data: { appointments?: Appointment[] }) => setAppointments(data.appointments ?? []))
      .finally(() => setIsLoading(false))
  }, [])

  const now = new Date()
  const nextAppointment = appointments.find((a) => a.status !== 'CANCELLED' && new Date(a.date) >= now)
  const pastAppointments = [...appointments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  async function submitRequest() {
    if (!requestModal || !reason.trim()) return
    setIsSubmitting(true)
    setActionError('')
    try {
      const res = await fetch(`/api/appointments/${requestModal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestType: requestModal.type, requestReason: reason.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setActionError(data.error ?? 'ส่งคำขอไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
        return
      }
      setAppointments((prev) => prev.map((a) => (a.id === requestModal.id ? { ...a, requestType: requestModal.type } : a)))
      setRequestModal(null)
      setReason('')
    } catch {
      setActionError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PatientHeader />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ประวัติการรักษา
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              ประวัติการเข้ารับบริการและการรักษาทั้งหมดของคุณ
            </p>
          </div>

          <Link
            href="/patient/dashboard"
            className={`inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:bg-white bg-white/80 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm ${focusRing}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>ย้อนกลับไปหน้าหลัก</span>
          </Link>
        </div>

        {isLoading ? (
          <>
            <section className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-6 sm:p-7">
              <SkeletonDetailPanel />
            </section>
            <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm overflow-hidden mt-6">
              <table className="w-full">
                <tbody>
                  <SkeletonTableRows rows={5} columns={4} />
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            {/* Latest / upcoming appointment */}
            <section className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-6 sm:p-7 space-y-4">
              <div className="flex items-center gap-2.5 text-blue-600 font-bold text-base sm:text-lg">
                <IconCalendar className="w-5 h-5 text-blue-600" />
                <span>นัดหมายที่กำลังจะถึง</span>
              </div>

              {!nextAppointment ? (
                <p className="text-sm text-slate-400 py-2">ยังไม่มีนัดหมายที่กำลังจะถึง</p>
              ) : (
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-1">
                  <div className="flex items-center gap-6">
                    <div className="bg-[#f8fafc] rounded-xl py-4 px-4 text-center min-w-[120px] sm:min-w-[130px] flex flex-col justify-center items-center shrink-0 border border-slate-100/60 shadow-sm">
                      <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                        {new Date(nextAppointment.date).getDate()}
                      </span>
                      <span className="text-xs font-bold text-blue-600 my-1">
                        {new Date(nextAppointment.date).toLocaleDateString('th-TH', { month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        ({new Date(nextAppointment.date).toLocaleDateString('th-TH', { weekday: 'short' })})
                      </span>
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
                      <p className="flex items-center gap-2.5">
                        <IconClock className="w-4 h-4 text-slate-600 shrink-0" />
                        <span>เวลา {new Date(nextAppointment.date).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.</span>
                      </p>
                      <p className="flex items-center gap-2.5">
                        <svg className="w-4 h-4 text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{formatDentist(nextAppointment.dentist)}</span>
                      </p>
                      <p className="flex items-center gap-2.5">
                        <IconTooth className="w-4 h-4 text-slate-600 shrink-0" />
                        <span>{nextAppointment.service.name}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    {nextAppointment.requestType ? (
                      <span className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-amber-50 text-amber-700">
                        {nextAppointment.requestType === 'CANCEL' ? 'ส่งคำขอยกเลิกแล้ว รอแอดมินพิจารณา' : 'ส่งคำขอเลื่อนนัดแล้ว รอแอดมินพิจารณา'}
                      </span>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => { setRequestModal({ id: nextAppointment.id, type: 'RESCHEDULE' }); setActionError('') }}
                          className={`px-5 py-2.5 border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shadow-sm ${focusRing}`}
                        >
                          <IconCalendar className="w-4 h-4 text-blue-600" />
                          <span>ขอเลื่อนนัด</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => { setRequestModal({ id: nextAppointment.id, type: 'CANCEL' }); setActionError('') }}
                          className={`px-5 py-2.5 border border-rose-300 text-rose-500 bg-[#fff5f5] hover:bg-rose-100/60 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shadow-sm ${focusRing}`}
                        >
                          <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <circle cx="12" cy="12" r="9" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6" />
                          </svg>
                          <span>ขอยกเลิกนัด</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* All appointment history */}
            <section className="space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900">
                ประวัติการนัดหมายทั้งหมด
              </h2>

              <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[650px]">
                    <thead>
                      <tr className="bg-[#f8fafc] text-xs font-bold text-slate-500 border-b border-slate-100">
                        <th className="py-3.5 px-6 w-[130px]">วันที่</th>
                        <th className="py-3.5 px-6">บริการ</th>
                        <th className="py-3.5 px-6">ทันตแพทย์</th>
                        <th className="py-3.5 px-6 text-center w-[130px]">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                      {pastAppointments.map((a) => (
                        <tr key={a.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="py-4 px-6 align-middle">
                            <span className="text-lg font-extrabold text-slate-900 block leading-tight">
                              {new Date(a.date).getDate()}
                            </span>
                            <span className="text-xs font-bold text-blue-600">
                              {new Date(a.date).toLocaleDateString('th-TH', { month: 'short', year: 'numeric' })}
                            </span>
                          </td>
                          <td className="py-4 px-6 align-middle font-bold text-slate-900 text-sm">{a.service.name}</td>
                          <td className="py-4 px-6 align-middle text-xs font-medium text-slate-600">{formatDentist(a.dentist)}</td>
                          <td className="py-4 px-6 align-middle text-center">
                            <span className={`inline-block px-3 py-1 rounded-xl text-xs font-bold ${statusLabel[a.status].style}`}>
                              {statusLabel[a.status].label}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {pastAppointments.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-10 px-6 text-center text-sm text-slate-400">ยังไม่มีประวัติการนัดหมาย</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        )}

        <section className="bg-[#f8fafc] rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-100/90 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm hover:scale-105 transition-transform duration-300">
              <IconHeadset className="w-6.5 h-6.5 sm:w-7 sm:h-7" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">
                มีคำถามเกี่ยวกับประวัติการรักษา?
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                ติดต่อเราได้ทุกช่องทาง
              </p>
            </div>
          </div>
        </section>
      </main>

      {requestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setRequestModal(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <h3 className="font-bold text-slate-900">
              {requestModal.type === 'CANCEL' ? 'ขอยกเลิกนัดหมาย' : 'ขอเลื่อนนัดหมาย'}
            </h3>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">เหตุผล</label>
              <textarea
                className={`w-full px-3 py-2 rounded-lg border border-slate-200 text-sm min-h-24 resize-none ${focusRing}`}
                placeholder="กรุณาระบุเหตุผล"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            {actionError && <p className="text-xs text-rose-600 font-medium">{actionError}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRequestModal(null)}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition ${focusRing}`}
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={!reason.trim() || isSubmitting}
                onClick={submitRequest}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition ${focusRing}`}
              >
                {isSubmitting ? 'กำลังส่ง...' : 'ส่งคำขอ'}
              </button>
            </div>
          </div>
        </div>
      )}

      <PatientFooter />
    </div>
  )
}
