'use client'

import { useState } from 'react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { IconPhone, IconFileText } from '@/components/shared/icons'
import { focusRing } from '@/lib/shared/focus-ring'
import type { DentistAppointment, PastVisit, TreatmentNote } from '@/app/dentist/_mock/appointments'
import { statusConfig } from '@/app/dentist/_mock/status'

const inputClass = `w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 focus:border-teal-400 transition-all ${focusRing}`
const labelClass = 'text-xs font-medium text-gray-500 mb-1.5 block'

const emptyNote: TreatmentNote = { toothNumber: '', diagnosis: '', treatmentNote: '', nextVisit: '' }

export function TreatmentPanel({
  appointment,
  history,
  onStart,
  onComplete,
  onSaveTreatment,
}: {
  appointment: DentistAppointment
  history: PastVisit[]
  onStart: () => void
  onComplete: () => void
  onSaveTreatment: (note: TreatmentNote) => void
}) {
  const [form, setForm] = useState<TreatmentNote>(() => appointment.treatment ?? emptyNote)

  function updateForm<K extends keyof TreatmentNote>(key: K, value: TreatmentNote[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const isCancelled = appointment.status === 'CANCELLED'

  return (
    <div className="space-y-6">
      {/* Patient + appointment summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-xl font-semibold shrink-0">
              {appointment.patientName.charAt(0)}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{appointment.patientName}</p>
              <p className="text-sm text-gray-500">{appointment.patientAge} ปี</p>
              <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-0.5">
                <IconPhone className="w-3.5 h-3.5" /> {appointment.patientPhone}
              </p>
            </div>
          </div>
          <StatusBadge label={statusConfig[appointment.status].label} tone={statusConfig[appointment.status].tone} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
          <div className="bg-slate-50 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-400">เวลานัด</p>
            <p className="text-sm font-medium text-gray-800 tabular-nums">{appointment.time} น.</p>
          </div>
          <div className="bg-slate-50 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-400">บริการ</p>
            <p className="text-sm font-medium text-gray-800">{appointment.serviceName}</p>
          </div>
          <div className="bg-slate-50 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-400">ระยะเวลา</p>
            <p className="text-sm font-medium text-gray-800">{appointment.durationMin} นาที</p>
          </div>
        </div>

        {appointment.note && (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-3">
            หมายเหตุ: {appointment.note}
          </p>
        )}

        {!isCancelled && (
          <div className="flex flex-wrap gap-2 mt-5">
            {(appointment.status === 'WAITING' || appointment.status === 'CONFIRMED') && (
              <button
                type="button"
                onClick={onStart}
                className={`px-4 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-all shadow-sm shadow-teal-200 ${focusRing}`}
              >
                เริ่มรักษา
              </button>
            )}
            <button
              type="button"
              onClick={() => onSaveTreatment(form)}
              className={`px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:border-teal-300 transition-all ${focusRing}`}
            >
              บันทึกการรักษา
            </button>
            {appointment.status === 'IN_TREATMENT' && (
              <button
                type="button"
                onClick={onComplete}
                className={`px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all ${focusRing}`}
              >
                เสร็จสิ้น
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Treatment note form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <IconFileText className="w-4 h-4 text-gray-400" />
            <h2 className="font-semibold text-gray-900">บันทึกการรักษา</h2>
          </div>
          <fieldset disabled={isCancelled} className="space-y-4 disabled:opacity-50">
            <div>
              <label className={labelClass}>ฟันที่รักษา</label>
              <input className={inputClass} value={form.toothNumber} onChange={(e) => updateForm('toothNumber', e.target.value)} placeholder="เช่น 36, 47" />
            </div>
            <div>
              <label className={labelClass}>ปัญหาที่พบ</label>
              <textarea className={`${inputClass} min-h-20 resize-none`} value={form.diagnosis} onChange={(e) => updateForm('diagnosis', e.target.value)} placeholder="อาการ/ปัญหาที่ตรวจพบ" />
            </div>
            <div>
              <label className={labelClass}>แนวทางการรักษา</label>
              <textarea className={`${inputClass} min-h-20 resize-none`} value={form.treatmentNote} onChange={(e) => updateForm('treatmentNote', e.target.value)} placeholder="สิ่งที่ทำการรักษาในครั้งนี้" />
            </div>
            <div>
              <label className={labelClass}>นัดครั้งถัดไป</label>
              <input type="date" className={inputClass} value={form.nextVisit} onChange={(e) => updateForm('nextVisit', e.target.value)} />
            </div>
          </fieldset>
        </div>

        {/* Visit history */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">ประวัติการรักษาที่ผ่านมา</h2>
            <p className="text-xs text-gray-400 mt-0.5">Visit history</p>
          </div>
          {history.length > 0 ? (
            <ul className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
              {history.map((v, i) => (
                <li key={i} className="px-6 py-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900">{v.serviceName}</p>
                    <p className="text-xs text-gray-400 tabular-nums">{new Date(v.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  {v.toothNumber && <p className="text-xs text-gray-500 mt-1">ฟันที่รักษา: {v.toothNumber}</p>}
                  {v.diagnosis && <p className="text-xs text-gray-500 mt-0.5">ปัญหา: {v.diagnosis}</p>}
                  {v.treatmentNote && <p className="text-xs text-gray-400 mt-0.5">{v.treatmentNote}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-gray-400">ยังไม่มีประวัติการรักษา</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
