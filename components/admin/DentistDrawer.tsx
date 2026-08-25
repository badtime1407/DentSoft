'use client'

import { useEffect, useState } from 'react'
import type { Specialty } from '@/app/admin/_mock/reference'
import type { AdminDentist, WeeklySchedule } from '@/app/admin/dentists/types'
import { IconX } from './icons'
import { focusRing } from '@/lib/admin/focus-ring'

export type DentistFormValues = {
  userId: string
  title: string
  firstName: string
  lastName: string
  specialty: Specialty
  phone: string
  schedule: WeeklySchedule
}

type PromotableUser = { id: string; email: string; firstName: string; lastName: string }

const inputClass = `w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 transition-all ${focusRing}`
const labelClass = 'text-xs font-medium text-gray-500 mb-1.5 block'
const dayLabels = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']
const titles = ['ทพ.', 'ทพญ.']

const specialties: Specialty[] = ['ทันตกรรมทั่วไป', 'ทันตกรรมจัดฟัน', 'ศัลยกรรมช่องปาก']

function defaultSchedule(): WeeklySchedule {
  return Array.from({ length: 7 }, (_, i) => ({
    active: i >= 1 && i <= 5,
    startTime: '09:00',
    endTime: '18:00',
  }))
}

function emptyValues(): DentistFormValues {
  return {
    userId: '',
    title: 'ทพ.',
    firstName: '',
    lastName: '',
    specialty: 'ทันตกรรมทั่วไป',
    phone: '',
    schedule: defaultSchedule(),
  }
}

export function DentistDrawer({
  open,
  mode,
  dentist,
  error,
  onClose,
  onSubmit,
}: {
  open: boolean
  mode: 'create' | 'edit'
  dentist?: AdminDentist
  error?: string
  onClose: () => void
  onSubmit: (values: DentistFormValues) => void
}) {
  const [values, setValues] = useState<DentistFormValues>(emptyValues())
  const [promotableUsers, setPromotableUsers] = useState<PromotableUser[]>([])

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && dentist) {
      setValues({
        ...emptyValues(),
        title: dentist.title,
        firstName: dentist.firstName,
        lastName: dentist.lastName,
        specialty: dentist.specialty,
        phone: dentist.phone,
        schedule: dentist.schedule,
      })
    } else {
      setValues(emptyValues())
      fetch('/api/users/promotable')
        .then((res) => res.json())
        .then((data: { users?: PromotableUser[] }) => setPromotableUsers(data.users ?? []))
    }
  }, [open, mode, dentist?.id])

  if (!open) return null

  function updateDay(index: number, patch: Partial<WeeklySchedule[number]>) {
    setValues((prev) => ({
      ...prev,
      schedule: prev.schedule.map((d, i) => (i === index ? { ...d, ...patch } : d)),
    }))
  }

  function handleSelectUser(userId: string) {
    const user = promotableUsers.find((u) => u.id === userId)
    setValues((prev) => ({
      ...prev,
      userId,
      firstName: user?.firstName || prev.firstName,
      lastName: user?.lastName || prev.lastName,
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white h-full shadow-xl flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-semibold text-gray-900">{mode === 'create' ? 'เพิ่มทันตแพทย์' : 'ข้อมูลทันตแพทย์'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{mode === 'create' ? 'New dentist' : 'Edit dentist'}</p>
          </div>
          <button type="button" onClick={onClose} className={`p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition ${focusRing}`}>
            <IconX className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div className="flex gap-2">
            <div className="w-24 shrink-0">
              <label className={labelClass}>คำนำหน้า</label>
              <select
                className={inputClass}
                value={values.title}
                onChange={(e) => setValues((p) => ({ ...p, title: e.target.value }))}
              >
                {titles.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className={labelClass}>ชื่อ</label>
              <input className={inputClass} value={values.firstName} onChange={(e) => setValues((p) => ({ ...p, firstName: e.target.value }))} placeholder="ชื่อ" />
            </div>
            <div className="flex-1">
              <label className={labelClass}>นามสกุล</label>
              <input className={inputClass} value={values.lastName} onChange={(e) => setValues((p) => ({ ...p, lastName: e.target.value }))} placeholder="นามสกุล" />
            </div>
          </div>

          <div>
            <label className={labelClass}>ความเชี่ยวชาญ</label>
            <select
              className={inputClass}
              value={values.specialty}
              onChange={(e) => setValues((p) => ({ ...p, specialty: e.target.value as Specialty }))}
            >
              {specialties.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>เบอร์โทร</label>
            <input className={inputClass} value={values.phone} onChange={(e) => setValues((p) => ({ ...p, phone: e.target.value }))} placeholder="08x-xxx-xxxx" />
          </div>

          {mode === 'create' && (
            <div className="space-y-2 border-t border-gray-100 pt-4">
              <label className={labelClass}>บัญชีทันตแพทย์ (เลือกจากผู้ที่สมัครสมาชิกไว้แล้ว)</label>
              <select
                className={inputClass}
                value={values.userId}
                onChange={(e) => handleSelectUser(e.target.value)}
              >
                <option value="">-- เลือกอีเมลบัญชี --</option>
                {promotableUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName || u.lastName ? `${u.firstName} ${u.lastName} — ${u.email}` : u.email}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-gray-400">
                ให้ทันตแพทย์สมัครสมาชิกด้วยตัวเองที่หน้าสมัครก่อน แล้วเลือกอีเมลของเขาที่นี่ ระบบจะไม่เห็นหรือตั้งรหัสผ่านให้
              </p>
            </div>
          )}

          <div>
            <label className={labelClass}>เวลาทำงานประจำสัปดาห์</label>
            <div className="space-y-1.5">
              {values.schedule.map((d, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-100 bg-slate-50">
                  <label className="flex items-center gap-2 w-24 shrink-0 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={d.active}
                      onChange={(e) => updateDay(i, { active: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {dayLabels[i]}
                  </label>
                  {d.active ? (
                    <div className="flex items-center gap-1.5 flex-1">
                      <input
                        type="time"
                        value={d.startTime}
                        onChange={(e) => updateDay(i, { startTime: e.target.value })}
                        className="flex-1 px-2 py-1 rounded-md border border-gray-200 text-xs text-gray-700"
                      />
                      <span className="text-gray-400 text-xs">-</span>
                      <input
                        type="time"
                        value={d.endTime}
                        onChange={(e) => updateDay(i, { endTime: e.target.value })}
                        className="flex-1 px-2 py-1 rounded-md border border-gray-200 text-xs text-gray-700"
                      />
                    </div>
                  ) : (
                    <span className="flex-1 text-xs text-gray-400">วันหยุด</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 shrink-0 space-y-3">
          {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
          <button
            type="button"
            disabled={mode === 'create' && !values.userId}
            onClick={() => onSubmit(values)}
            className={`w-full px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${focusRing}`}
          >
            {mode === 'create' ? 'บันทึกทันตแพทย์' : 'บันทึกการแก้ไข'}
          </button>
        </div>
      </div>
    </div>
  )
}
