'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { AdminPatient } from '@/app/admin/patients/types'
import { IconX, IconCalendarPlus } from './icons'
import { focusRing } from '@/lib/admin/focus-ring'

export type PatientFormValues = {
  firstName: string
  lastName: string
  phone: string
  birthDate: string
  allergyNote: string
}

const inputClass = `w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 transition-all ${focusRing}`
const labelClass = 'text-xs font-medium text-gray-500 mb-1.5 block'

const emptyValues: PatientFormValues = { firstName: '', lastName: '', phone: '', birthDate: '', allergyNote: '' }

const sourceLabel: Record<AdminPatient['source'], string> = {
  ONLINE: 'สมัครออนไลน์',
  WALK_IN: 'Walk-in',
}

export function PatientDrawer({
  open,
  mode,
  patient,
  error,
  onClose,
  onSubmit,
}: {
  open: boolean
  mode: 'create' | 'edit'
  patient?: AdminPatient
  error?: string
  onClose: () => void
  onSubmit: (values: PatientFormValues) => void
}) {
  const [values, setValues] = useState<PatientFormValues>(emptyValues)

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && patient) {
      setValues({
        firstName: patient.firstName,
        lastName: patient.lastName,
        phone: patient.phone ?? '',
        birthDate: patient.birthDate ?? '',
        allergyNote: patient.allergyNote ?? '',
      })
    } else {
      setValues(emptyValues)
    }
  }, [open, mode, patient?.id])

  if (!open) return null

  function update<K extends keyof PatientFormValues>(key: K, value: PatientFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white h-full shadow-xl flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-semibold text-gray-900">{mode === 'create' ? 'เพิ่มคนไข้ Walk-in' : 'ข้อมูลคนไข้'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{mode === 'create' ? 'New walk-in patient' : 'Patient profile'}</p>
          </div>
          <button type="button" onClick={onClose} className={`p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition ${focusRing}`}>
            <IconX className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {mode === 'create' && (
            <p className="text-[11px] text-gray-400 bg-slate-50 rounded-lg px-3 py-2.5">
              ใช้สำหรับคนไข้ที่มาที่คลินิกโดยตรง ไม่ได้สมัครสมาชิกผ่านเว็บไซต์ จึงไม่มีบัญชีเข้าสู่ระบบ
            </p>
          )}

          {mode === 'edit' && patient && (
            <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">ประเภทบัญชี</span>
                <span className={`font-medium ${patient.source === 'ONLINE' ? 'text-blue-600' : 'text-gray-700'}`}>
                  {sourceLabel[patient.source]}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">นัดครั้งล่าสุด</span>
                <span className="font-medium text-gray-800">
                  {patient.lastVisitDate ? new Date(patient.lastVisitDate + 'T00:00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : 'ยังไม่เคยมา'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">นัดครั้งถัดไป</span>
                <span className="font-medium text-gray-800">
                  {patient.nextAppointmentDate
                    ? `${new Date(patient.nextAppointmentDate + 'T00:00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} · ${patient.nextAppointmentLabel}`
                    : 'ยังไม่มีนัด'}
                </span>
              </div>
              <Link
                href="/admin/appointments"
                className={`flex items-center justify-center gap-2 mt-2 px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700 transition-all ${focusRing}`}
              >
                <IconCalendarPlus className="w-3.5 h-3.5" />
                จองนัดหมาย
              </Link>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>ชื่อ</label>
              <input className={inputClass} value={values.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="ชื่อ" />
            </div>
            <div>
              <label className={labelClass}>นามสกุล</label>
              <input className={inputClass} value={values.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="นามสกุล" />
            </div>
          </div>

          <div>
            <label className={labelClass}>เบอร์โทร</label>
            <input className={inputClass} value={values.phone} onChange={(e) => update('phone', e.target.value)} placeholder="08x-xxx-xxxx" />
          </div>

          <div>
            <label className={labelClass}>วันเกิด</label>
            <input type="date" className={inputClass} value={values.birthDate} onChange={(e) => update('birthDate', e.target.value)} />
          </div>

          <div>
            <label className={labelClass}>ประวัติแพ้ยา / ข้อควรระวัง</label>
            <textarea
              className={`${inputClass} min-h-20 resize-none`}
              value={values.allergyNote}
              onChange={(e) => update('allergyNote', e.target.value)}
              placeholder="เช่น แพ้ยาชา, โรคประจำตัว (ถ้ามี)"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 shrink-0 space-y-3">
          {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
          <button
            type="button"
            onClick={() => onSubmit(values)}
            className={`w-full px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all ${focusRing}`}
          >
            {mode === 'create' ? 'บันทึกคนไข้ใหม่' : 'บันทึกการแก้ไข'}
          </button>
        </div>
      </div>
    </div>
  )
}
