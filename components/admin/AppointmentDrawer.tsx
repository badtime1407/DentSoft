'use client'

import { useEffect, useState } from 'react'
import type { AdminAppointment, AdminDentistOption, AdminServiceOption } from '@/app/admin/appointments/types'
import type { AdminPatient } from '@/app/admin/patients/types'
import type { CancelRequestType } from './CancelRequestsProvider'
import { IconX, IconAlertTriangle, IconRotate, IconPlus } from './icons'
import { focusRing } from '@/lib/shared/focus-ring'

export type AppointmentFormValues = {
  patientId: string
  serviceId: string
  dentistId: string
  date: string
  startTime: string
  note: string
}

export type NewPatientValues = { firstName: string; lastName: string; phone: string }

const inputClass = `w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 transition-all ${focusRing}`
const labelClass = 'text-xs font-medium text-gray-500 mb-1.5 block'

export function AppointmentDrawer({
  open,
  mode,
  appointment,
  defaults,
  services,
  dentists,
  patients,
  cancelRequest,
  onClose,
  onSubmit,
  onCreatePatient,
  onConfirm,
  onCancelAppointment,
}: {
  open: boolean
  mode: 'create' | 'edit'
  appointment?: AdminAppointment
  defaults?: { date: string; dentistId?: string; startTime?: string }
  services: AdminServiceOption[]
  dentists: AdminDentistOption[]
  patients: AdminPatient[]
  cancelRequest?: { type: CancelRequestType; reason: string }
  onClose: () => void
  onSubmit: (values: AppointmentFormValues) => void
  onCreatePatient: (values: NewPatientValues) => Promise<AdminPatient | null>
  onConfirm?: () => void
  onCancelAppointment?: () => void
}) {
  const [values, setValues] = useState<AppointmentFormValues>({
    patientId: '',
    serviceId: services[0]?.id ?? '',
    dentistId: defaults?.dentistId ?? '',
    date: defaults?.date ?? '',
    startTime: defaults?.startTime ?? '09:00',
    note: '',
  })
  const [patientSearch, setPatientSearch] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<AdminPatient | null>(null)
  const [creatingPatient, setCreatingPatient] = useState(false)
  const [newPatient, setNewPatient] = useState<NewPatientValues>({ firstName: '', lastName: '', phone: '' })

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && appointment) {
      const d = new Date(appointment.date)
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
      setValues({
        patientId: appointment.patientId,
        serviceId: appointment.serviceId,
        dentistId: appointment.dentistId ?? '',
        date: dateStr,
        startTime: timeStr,
        note: appointment.note ?? '',
      })
      setSelectedPatient(null)
    } else {
      setValues({
        patientId: '',
        serviceId: services[0]?.id ?? '',
        dentistId: defaults?.dentistId ?? '',
        date: defaults?.date ?? '',
        startTime: defaults?.startTime ?? '09:00',
        note: '',
      })
      setSelectedPatient(null)
      setPatientSearch('')
      setCreatingPatient(false)
      setNewPatient({ firstName: '', lastName: '', phone: '' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode, appointment?.id])

  if (!open) return null

  function update<K extends keyof AppointmentFormValues>(key: K, value: AppointmentFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const matchingPatients =
    patientSearch.trim().length > 0
      ? patients
          .filter((p) => {
            const term = patientSearch.trim().toLowerCase()
            return `${p.firstName} ${p.lastName}`.toLowerCase().includes(term) || (p.phone ?? '').includes(term)
          })
          .slice(0, 8)
      : []

  function pickPatient(p: AdminPatient) {
    setSelectedPatient(p)
    update('patientId', p.id)
    setPatientSearch('')
  }

  async function handleCreatePatient() {
    if (!newPatient.firstName || !newPatient.lastName) return
    const created = await onCreatePatient(newPatient)
    if (created) {
      pickPatient(created)
      setCreatingPatient(false)
      setNewPatient({ firstName: '', lastName: '', phone: '' })
    }
  }

  const selectedService = services.find((s) => s.id === values.serviceId)

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

          <div>
            <label className={labelClass}>คนไข้</label>
            {mode === 'edit' && appointment ? (
              <div className="px-3 py-2 rounded-lg bg-slate-50 border border-gray-100 text-sm text-gray-700">
                <p className="font-medium">{appointment.patientName}</p>
                <p className="text-xs text-gray-400">{appointment.patientPhone ?? '—'}</p>
              </div>
            ) : selectedPatient ? (
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 text-sm text-blue-800">
                <div>
                  <p className="font-medium">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                  <p className="text-xs text-blue-500">{selectedPatient.phone ?? '—'}</p>
                </div>
                <button type="button" onClick={() => { setSelectedPatient(null); update('patientId', '') }} className={`text-xs text-blue-600 hover:underline ${focusRing}`}>
                  เปลี่ยน
                </button>
              </div>
            ) : creatingPatient ? (
              <div className="space-y-2 p-3 rounded-lg border border-gray-100 bg-slate-50">
                <div className="grid grid-cols-2 gap-2">
                  <input className={inputClass} placeholder="ชื่อ" value={newPatient.firstName} onChange={(e) => setNewPatient((p) => ({ ...p, firstName: e.target.value }))} />
                  <input className={inputClass} placeholder="นามสกุล" value={newPatient.lastName} onChange={(e) => setNewPatient((p) => ({ ...p, lastName: e.target.value }))} />
                </div>
                <input className={inputClass} placeholder="เบอร์โทร" value={newPatient.phone} onChange={(e) => setNewPatient((p) => ({ ...p, phone: e.target.value }))} />
                <div className="flex gap-2">
                  <button type="button" onClick={handleCreatePatient} className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-900 text-white hover:bg-gray-800 transition ${focusRing}`}>
                    บันทึกคนไข้ใหม่
                  </button>
                  <button type="button" onClick={() => setCreatingPatient(false)} className={`px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-gray-100 transition ${focusRing}`}>
                    ยกเลิก
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <input
                  className={inputClass}
                  placeholder="ค้นหาชื่อหรือเบอร์โทรคนไข้..."
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                />
                {matchingPatients.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-100 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {matchingPatients.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => pickPatient(p)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition"
                      >
                        <span className="font-medium text-gray-800">{p.firstName} {p.lastName}</span>{' '}
                        <span className="text-xs text-gray-400">{p.phone ?? '—'}</span>
                      </button>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setCreatingPatient(true)}
                  className={`mt-2 flex items-center gap-1.5 text-xs text-blue-600 hover:underline ${focusRing}`}
                >
                  <IconPlus className="w-3 h-3" /> เพิ่มคนไข้ใหม่
                </button>
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>บริการ</label>
            <select className={inputClass} value={values.serviceId} onChange={(e) => update('serviceId', e.target.value)}>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {selectedService && (
              <p className="text-xs text-gray-400 mt-1.5">
                {selectedService.duration ?? 30} นาที · ฿{selectedService.minPrice.toLocaleString()}
                {selectedService.maxPrice !== selectedService.minPrice ? ` - ฿${selectedService.maxPrice.toLocaleString()}` : ''}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>ทันตแพทย์</label>
            <select className={inputClass} value={values.dentistId} onChange={(e) => update('dentistId', e.target.value)}>
              <option value="">ยังไม่มอบหมาย</option>
              {dentists.map((d) => (
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
              disabled={mode === 'create' && !values.patientId}
              onClick={() => onSubmit(values)}
              className={`flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${focusRing}`}
            >
              {mode === 'create' ? 'บันทึกนัดหมาย' : 'บันทึกการแก้ไข'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
