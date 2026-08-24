'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PatientHeader } from '@/components/patient/PatientHeader'
import { PatientFooter } from '@/components/patient/PatientFooter'
import { focusRing } from '@/lib/shared/focus-ring'

type Service = {
  id: string
  name: string
  minPrice: number
  maxPrice: number
}

function formatPrice(service: Service) {
  const min = service.minPrice.toLocaleString('th-TH')
  if (service.minPrice === service.maxPrice) return `฿${min}`
  return `฿${min} - ฿${service.maxPrice.toLocaleString('th-TH')}`
}

const TIME_SLOTS = ['10:00', '11:30', '14:00', '16:00']

export default function PatientBookingPage() {
  return (
    <Suspense fallback={null}>
      <BookingForm />
    </Suspense>
  )
}

function BookingForm() {
  const searchParams = useSearchParams()
  const preselectedServiceId = searchParams.get('serviceId')

  const [services, setServices] = useState<Service[]>([])
  const [serviceId, setServiceId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState(TIME_SLOTS[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<'success' | 'error' | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data: { services: Service[] }) => {
        setServices(data.services ?? [])
        if (preselectedServiceId && data.services?.some((s) => s.id === preselectedServiceId)) {
          setServiceId(preselectedServiceId)
        } else if (data.services?.[0]) {
          setServiceId(data.services[0].id)
        }
      })
  }, [preselectedServiceId])

  async function handleSubmit() {
    if (!serviceId || !date) return
    setIsSubmitting(true)
    setResult(null)

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId, date: `${date}T${time}:00` }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error ?? 'จองนัดหมายไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
        setResult('error')
        return
      }

      setResult('success')
    } catch {
      setErrorMessage('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
      setResult('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PatientHeader />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              จองนัดหมายใหม่
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              เลือกบริการและวันเวลาที่ต้องการเข้ารับการรักษา
            </p>
          </div>
          <Link
            href="/patient/dashboard"
            className={`px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-white transition ${focusRing}`}
          >
            กลับหน้าหลัก
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6 max-w-2xl">
          {result === 'success' ? (
            <div className="text-center space-y-4 py-6">
              <p className="text-lg font-bold text-slate-900">จองนัดหมายเรียบร้อยแล้ว</p>
              <p className="text-sm text-slate-500">
                ทางคลินิกจะติดต่อยืนยันวันเวลาและจัดทันตแพทย์ให้อีกครั้ง
              </p>
              <Link
                href="/patient/dashboard"
                className={`inline-block px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition ${focusRing}`}
              >
                กลับหน้าหลัก
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">เลือกรายการบริการ</label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm ${focusRing}`}
                >
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} ({formatPrice(service)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">วันที่ต้องการนัด</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm ${focusRing}`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">เวลา</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm ${focusRing}`}
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot} น.
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {result === 'error' && (
                <p className="text-xs text-rose-600 font-medium">{errorMessage}</p>
              )}

              <button
                type="button"
                disabled={!serviceId || !date || isSubmitting}
                onClick={handleSubmit}
                className={`w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-2xl shadow-md transition ${focusRing}`}
              >
                {isSubmitting ? 'กำลังจอง...' : 'ยืนยันการจองนัดหมาย'}
              </button>
            </>
          )}
        </div>
      </main>

      <PatientFooter />
    </div>
  )
}
