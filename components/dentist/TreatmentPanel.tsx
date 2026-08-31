/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { IconPhone, IconFileText, IconImageIcon, IconUpload, IconX } from '@/components/shared/icons'
import { focusRing } from '@/lib/shared/focus-ring'
import type { DentistAppointment, PastVisit, TreatmentNote } from '@/components/dentist/types'
import { queueStatusConfig } from '@/lib/dentist/status-config'

const inputClass = `w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 transition-all ${focusRing}`
const labelClass = 'text-xs font-medium text-gray-500 mb-1.5 block'
const chipClass = `px-2.5 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[11px] font-medium rounded-full border border-slate-200 transition ${focusRing}`

const emptyNote: TreatmentNote = { toothNumber: '', diagnosis: '', treatmentItems: [], nextVisit: '', images: [] }

const serviceTemplates: Record<string, { diagnosis: string; treatmentItems: string[] }> = {
  'ตรวจสุขภาพฟัน': { diagnosis: 'ตรวจสุขภาพฟันและเหงือกโดยรวม ไม่พบความผิดปกติ', treatmentItems: ['ตรวจสุขภาพฟันประจำปี', 'แนะนำการดูแลสุขภาพช่องปาก'] },
  'ขูดหินปูน': { diagnosis: 'หินปูนสะสมปานกลาง', treatmentItems: ['ขูดหินปูนทั่วปาก', 'แนะนำแปรงฟันเช้า-เย็น'] },
  'อุดฟัน': { diagnosis: 'ฟันผุระยะเริ่มต้น', treatmentItems: ['อุดฟันด้วยวัสดุเรซินสีเหมือนฟัน'] },
  'จัดฟัน (ปรับลวด)': { diagnosis: 'ปรับลวดประจำเดือน', treatmentItems: ['ปรับแรงดึงลวดบนล่าง', 'นัดครั้งถัดไปตามกำหนด'] },
  'รักษารากฟัน': { diagnosis: 'เนื้อเยื่อในโพรงประสาทฟันอักเสบ', treatmentItems: ['รักษารากฟัน', 'ทำความสะอาดคลองรากฟัน'] },
  'ครอบฟัน': { diagnosis: 'ฟันแตก/บิ่น ต้องการครอบฟันเพื่อป้องกันการแตกเพิ่ม', treatmentItems: ['พิมพ์ปากเพื่อทำครอบฟัน'] },
}

const diagnosisChips = ['ฟันผุ', 'หินปูนสะสม', 'เหงือกอักเสบ', 'ปกติดี']
const treatmentChips = ['อุดฟันด้วยเรซิน', 'ขูดหินปูนทั่วปาก', 'ถอนฟัน', 'นัดติดตามอาการ']

function toDateInputValue(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return toDateInputValue(d)
}

function addMonths(dateStr: string, months: number) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setMonth(d.getMonth() + months)
  return toDateInputValue(d)
}

export function TreatmentPanel({
  appointment,
  history,
  onComplete,
  onSaveTreatment,
}: {
  appointment: DentistAppointment
  history: PastVisit[]
  onStart?: () => void
  onComplete?: () => void
  onSaveTreatment: (note: TreatmentNote) => void
}) {
  const [form, setForm] = useState<TreatmentNote>(() => {
    if (appointment.treatment) return { images: [], ...appointment.treatment }
    const template = serviceTemplates[appointment.serviceName]
    return template ? { ...emptyNote, diagnosis: template.diagnosis, treatmentItems: template.treatmentItems } : emptyNote
  })

  const [previewImage, setPreviewImage] = useState<string | null>(null)

  function updateForm<K extends keyof TreatmentNote>(key: K, value: TreatmentNote[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function appendDiagnosisChip(text: string) {
    setForm((prev) => ({ ...prev, diagnosis: prev.diagnosis ? `${prev.diagnosis} ${text}` : text }))
  }

  function addTreatmentItem(text = '') {
    setForm((prev) => ({ ...prev, treatmentItems: [...prev.treatmentItems, text] }))
  }

  function updateTreatmentItem(index: number, text: string) {
    setForm((prev) => ({ ...prev, treatmentItems: prev.treatmentItems.map((item, i) => (i === index ? text : item)) }))
  }

  function removeTreatmentItem(index: number) {
    setForm((prev) => ({ ...prev, treatmentItems: prev.treatmentItems.filter((_, i) => i !== index) }))
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        if (result) {
          setForm((prev) => ({
            ...prev,
            images: [...(prev.images || []), result],
          }))
        }
      }
      reader.readAsDataURL(file)
    })
  }

  function removeImage(index: number) {
    setForm((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }))
  }

  const isCancelled = appointment.status === 'CANCELLED'

  return (
    <div className="space-y-6">
      {/* Patient + appointment summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-semibold shrink-0">
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
          <StatusBadge label={queueStatusConfig[appointment.status].label} tone={queueStatusConfig[appointment.status].tone} />
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

        {!isCancelled && (
          <div className="flex flex-wrap gap-2 mt-5">
            <button
              type="button"
              onClick={() => onSaveTreatment(form)}
              className={`px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all ${focusRing}`}
            >
              บันทึกร่าง
            </button>
            <button
              type="button"
              onClick={() => {
                onSaveTreatment(form)
                onComplete?.()
              }}
              className={`px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 ${focusRing}`}
            >
              เสร็จสิ้นการรักษา
            </button>
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

          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4">
            <p className="text-[11px] font-semibold text-blue-700 mb-0.5">สิ่งที่คนไข้จองมา</p>
            <p className="text-sm font-medium text-slate-800">{appointment.serviceName}</p>
            {appointment.note && <p className="text-xs text-slate-500 mt-1">หมายเหตุจากคนไข้: {appointment.note}</p>}
          </div>

          <fieldset disabled={isCancelled} className="space-y-4 disabled:opacity-50">
            <div>
              <label className={labelClass}>ฟันที่รักษา</label>
              <input className={inputClass} value={form.toothNumber} onChange={(e) => updateForm('toothNumber', e.target.value)} placeholder="เช่น 36, 47" />
            </div>
            <div>
              <label className={labelClass}>ปัญหาที่พบ</label>
              <textarea className={`${inputClass} min-h-20 resize-none`} value={form.diagnosis} onChange={(e) => updateForm('diagnosis', e.target.value)} placeholder="อาการ/ปัญหาที่ตรวจพบ" />
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {diagnosisChips.map((chip) => (
                  <button key={chip} type="button" onClick={() => appendDiagnosisChip(chip)} className={chipClass}>
                    + {chip}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>สิ่งที่ทำวันนี้</label>
              <div className="space-y-2">
                {form.treatmentItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      className={inputClass}
                      value={item}
                      onChange={(e) => updateTreatmentItem(idx, e.target.value)}
                      placeholder="เช่น ขูดหินปูนทั่วปาก"
                    />
                    <button
                      type="button"
                      onClick={() => removeTreatmentItem(idx)}
                      className={`shrink-0 p-2 rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition ${focusRing}`}
                      title="ลบรายการนี้"
                    >
                      <IconX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {form.treatmentItems.length === 0 && (
                  <p className="text-xs text-gray-400">ยังไม่มีรายการที่ทำ กด &quot;เพิ่มรายการ&quot; หรือเลือกจากด้านล่าง</p>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <button type="button" onClick={() => addTreatmentItem()} className={chipClass}>
                  + เพิ่มรายการ
                </button>
                {treatmentChips.map((chip) => (
                  <button key={chip} type="button" onClick={() => addTreatmentItem(chip)} className={chipClass}>
                    + {chip}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>นัดครั้งถัดไป</label>
              <input type="date" className={inputClass} value={form.nextVisit} onChange={(e) => updateForm('nextVisit', e.target.value)} />
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                <button type="button" onClick={() => updateForm('nextVisit', addDays(appointment.date, 7))} className={chipClass}>
                  +1 สัปดาห์
                </button>
                <button type="button" onClick={() => updateForm('nextVisit', addDays(appointment.date, 14))} className={chipClass}>
                  +2 สัปดาห์
                </button>
                <button type="button" onClick={() => updateForm('nextVisit', addMonths(appointment.date, 1))} className={chipClass}>
                  +1 เดือน
                </button>
              </div>
            </div>

            {/* Image Upload & Attachment Section */}
            <div className="pt-2 border-t border-slate-100">
              <label className={labelClass + ' flex items-center justify-between'}>
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <IconImageIcon className="w-4 h-4 text-gray-400" />
                  รูปภาพการรักษา / X-Ray
                </span>
                <span className="text-[11px] text-slate-400">
                  {form.images?.length || 0} รูป
                </span>
              </label>

              <div className="space-y-3 mt-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <label className={`cursor-pointer px-3.5 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${focusRing}`}>
                    <IconUpload className="w-4 h-4" />
                    เพิ่มรูปภาพ / X-Ray
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isCancelled}
                    />
                  </label>
                </div>

                {/* Images Preview Grid */}
                {form.images && form.images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                    {form.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm"
                      >
                        <img
                          src={imgUrl}
                          alt={`รูปการรักษา ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                          onClick={() => setPreviewImage(imgUrl)}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center pointer-events-none">
                          <span className="opacity-0 group-hover:opacity-100 text-white text-[10px] font-bold bg-black/60 px-2 py-0.5 rounded-full transition-opacity">
                            ขยายดู
                          </span>
                        </div>
                        {!isCancelled && (
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 w-5 h-5 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md transition"
                            title="ลบรูปนี้"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                  {v.images && v.images.length > 0 && (
                    <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
                      {v.images.map((img, imgIdx) => (
                        <img
                          key={imgIdx}
                          src={img}
                          alt="Past visit photo"
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 cursor-pointer hover:opacity-80 transition shrink-0"
                          onClick={() => setPreviewImage(img)}
                        />
                      ))}
                    </div>
                  )}
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

      {/* Lightbox Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
            <img
              src={previewImage}
              alt="Treatment Image Lightbox"
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors text-xs font-bold"
            >
              ✕ ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
