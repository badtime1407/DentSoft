'use client'

import { useEffect, useState } from 'react'
import { dentistsForService, services, type ReferenceDentist } from '@/app/admin/_mock/reference'
import type { ScheduleAppointment } from '@/app/admin/appointments/mock-appointments'
import type { CancelRequestType } from './CancelRequestsProvider'
import { IconX, IconAlertTriangle, IconRotate } from './icons'
import { focusRing } from '@/lib/admin/focus-ring'

export type AppointmentFormValues = {
  patientName: string
  patientPhone: string
  serviceId: string
  dentistId: string
  date: string
  startTime: string
  note: string
}

const inputClass = `w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 transition-all ${focusRing}`
const labelClass = 'text-xs font-medium text-gray-500 mb-1.5 block'

export function AppointmentDrawer({
  open,
  mode,
  appointment,
  defaults,
  allDentists,
  cancelRequest,
  onClose,
  onSubmit,
  onConfirm,
  onCancelAppointment,
}: {
  open: boolean
  mode: 'create' | 'edit'
  appointment?: ScheduleAppointment
  defaults?: { date: string; dentistId?: string; startTime?: string }
  allDentists: ReferenceDentist[]
  cancelRequest?: { type: CancelRequestType; reason: string }
  onClose: () => void
  onSubmit: (values: AppointmentFormValues) => void
  onConfirm?: () => void
  onCancelAppointment?: () => void
}) {
  const [values, setValues] = useState<AppointmentFormValues>({
    patientName: '',
    patientPhone: '',
    serviceId: services[0].id,
    dentistId: allDentists[0]?.id ?? '',
    date: defaults?.date ?? '',
    startTime: defaults?.startTime ?? '09:00',
    note: '',
  })

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && appointment) {
      setValues({
        patientName: appointment.patientName,
        patientPhone: appointment.patientPhone,
        serviceId: appointment.serviceId,
        dentistId: appointment.dentistId,
        date: appointment.date,
        startTime: appointment.startTime,
        note: appointment.note ?? '',
      })
    } else {
      const prefillDentist = allDentists.find((d) => d.id === defaults?.dentistId)
      const compatibleService = prefillDentist
        ? services.find((s) => s.specialties.includes(prefillDentist.specialty))
        : undefined
      setValues({
        patientName: '',
        patientPhone: '',
        serviceId: compatibleService?.id ?? services[0].id,
        dentistId: defaults?.dentistId ?? allDentists[0]?.id ?? '',
        date: defaults?.date ?? '',
        startTime: defaults?.startTime ?? '09:00',
        note: '',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode, appointment?.id])

  if (!open) return null

  const availableDentists = dentistsForService(values.serviceId)
  const selectedService = services.find((s) => s.id === values.serviceId)

  function update<K extends keyof AppointmentFormValues>(key: K, value: AppointmentFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white h-full shadow-xl flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-semibold text-gray-900">{mode === 'create' ? 'เพิ่มนัดหมาย' : 'รายละเอียดนัดหมาย'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{mode === 'create' ? 'New appointment' : 'Edit appointment'}</p>
          </div>
          <button type="button" onClick={onClose} className={`p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition ${focusRing}`}>
            <IconX className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {cancelRequest && (
            <div
              className={`flex items-start gap-2 rounded-xl px-3.5 py-3 border ${
                cancelRequest.type === 'RESCHEDULE' ? 'bg-amber-50 border-amber-200' : 'bg-rose-50 border-rose-200'
              }`}
            >
              {cancelRequest.type === 'RESCHEDULE' ? (
                <IconRotate className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              ) : (
                <IconAlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`text-sm font-medium ${cancelRequest.type === 'RESCHEDULE' ? 'text-amber-800' : 'text-rose-800'}`}>
                  {cancelRequest.type === 'RESCHEDULE' ? 'คนไข้ขอเลื่อนนัดหมายนี้' : 'คนไข้ขอยกเลิกนัดหมายนี้'}
                </p>
                <p className={`text-xs mt-0.5 ${cancelRequest.type === 'RESCHEDULE' ? 'text-amber-600' : 'text-rose-600'}`}>
                  เหตุผล: {cancelRequest.reason}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={labelClass}>ชื่อคนไข้</label>
              <input className={inputClass} value={values.patientName} onChange={(e) => update('patientName', e.target.value)} placeholder="ชื่อ-นามสกุล" />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>เบอร์โทร</label>
              <input className={inputClass} value={values.patientPhone} onChange={(e) => update('patientPhone', e.target.value)} placeholder="08x-xxx-xxxx" />
            </div>
          </div>

          <div>
            <label className={labelClass}>บริการ</label>
            <select className={inputClass} value={values.serviceId} onChange={(e) => update('serviceId', e.target.value)}>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {selectedService && (
              <p className="text-xs text-gray-400 mt-1.5">{selectedService.durationMin} นาที · ฿{selectedService.price.toLocaleString()}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>ทันตแพทย์</label>
            <select className={inputClass} value={values.dentistId} onChange={(e) => update('dentistId', e.target.value)}>
              {availableDentists.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>วันที่</label>
              <input type="date" className={inputClass} value={values.date} onChange={(e) => update('date', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>เวลา</label>
              <input type="time" className={inputClass} value={values.startTime} onChange={(e) => update('startTime', e.target.value)} />
            </div>
          </div>

          <div>
            <label className={labelClass}>บันทึกเพิ่มเติม</label>
            <textarea className={`${inputClass} min-h-20 resize-none`} value={values.note} onChange={(e) => update('note', e.target.value)} placeholder="รายละเอียดเพิ่มเติม (ถ้ามี)" />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 shrink-0 space-y-2">
          {mode === 'edit' && appointment?.status === 'PENDING' && onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              className={`w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 ${focusRing}`}
            >
              ยืนยันนัดหมาย
            </button>
          )}
          <div className="flex gap-2">
            {mode === 'edit' && appointment?.status !== 'CANCELLED' && onCancelAppointment && (
              <button
                type="button"
                onClick={onCancelAppointment}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium text-rose-500 border border-rose-200 hover:bg-rose-50 transition-all ${focusRing}`}
              >
                ยกเลิกนัดหมาย
              </button>
            )}
            <button
              type="button"
              onClick={() => onSubmit(values)}
              className={`flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all ${focusRing}`}
            >
              {mode === 'create' ? 'บันทึกนัดหมาย' : 'บันทึกการแก้ไข'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
