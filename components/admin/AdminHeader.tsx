'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { IconLogout, IconBell, IconAlertTriangle, IconRotate } from './icons'
import { focusRing } from '@/lib/shared/focus-ring'
import { useCancelRequests } from './CancelRequestsProvider'

function formatNow(date: Date) {
  const day = date.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const time = date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
  return `${day} · ${time} น.`
}

export function AdminHeader() {
  const [now, setNow] = useState<Date | null>(null)
  const [notifOpen, setNotifOpen] = useState(false)
  const { requests } = useCancelRequests()
  const router = useRouter()
  const { data: session } = useSession()
  const adminLabel = session?.user?.email ?? 'ผู้ดูแลระบบ'

  useEffect(() => {
    setNow(new Date())
    const timer = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(timer)
  }, [])

  function goToRequest(appointmentId: string) {
    setNotifOpen(false)
    router.push(`/admin/appointments?requestId=${appointmentId}`)
  }

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30 shrink-0">
      <p className="text-sm text-gray-500">{now ? formatNow(now) : ''}</p>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="การแจ้งเตือน"
            className={`relative p-2.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition ${focusRing}`}
          >
            <IconBell className="w-5 h-5" />
            {requests.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl border border-gray-100 shadow-lg z-50 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">คำขอจากคนไข้</p>
                  <p className="text-xs text-gray-400 mt-0.5">ขอยกเลิก / ขอเลื่อนนัด · รอการพิจารณา</p>
                </div>

                {requests.length > 0 ? (
                  <ul className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
                    {requests.map((r) => {
                      const isReschedule = r.type === 'RESCHEDULE'
                      return (
                        <li key={r.id} className="px-5 py-4">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <p className="text-sm font-medium text-gray-900">{r.patientName}</p>
                            <p className="text-[11px] text-gray-400 shrink-0">{r.requestedAt}</p>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">
                            {new Date(r.date + 'T00:00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} · {r.startTime} น. ·{' '}
                            {r.serviceName} · {r.dentistName}
                          </p>
                          <div
                            className={`flex items-start gap-1.5 rounded-lg px-2.5 py-2 mb-3 border ${
                              isReschedule ? 'bg-amber-50 border-amber-100' : 'bg-rose-50 border-rose-100'
                            }`}
                          >
                            {isReschedule ? (
                              <IconRotate className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                            ) : (
                              <IconAlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <p className={`text-[11px] font-semibold mb-0.5 ${isReschedule ? 'text-amber-700' : 'text-rose-700'}`}>
                                {isReschedule ? 'ขอเลื่อนนัด' : 'ขอยกเลิกนัดหมาย'}
                              </p>
                              <p className={`text-xs ${isReschedule ? 'text-amber-700' : 'text-rose-700'}`}>{r.reason}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => goToRequest(r.appointmentId)}
                            className={`w-full px-3 py-2 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition ${focusRing}`}
                          >
                            พิจารณาคำขอ
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="px-5 py-8 text-center text-sm text-gray-400">ไม่มีคำขอในขณะนี้</p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-sm font-semibold">
            {adminLabel.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block min-w-0">
            <p className="text-sm font-medium text-gray-900 leading-none truncate">{adminLabel}</p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">ผู้ดูแลระบบ</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/login' })}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-50 transition ${focusRing}`}
        >
          <IconLogout className="w-4 h-4" /> ออกจากระบบ
        </button>
      </div>
    </header>
  )
}
