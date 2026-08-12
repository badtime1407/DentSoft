/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { IconPhone, IconFileText, IconImageIcon, IconUpload } from '@/components/shared/icons'
import { focusRing } from '@/lib/shared/focus-ring'
import type { DentistAppointment, PastVisit, TreatmentNote } from '@/app/dentist/_mock/appointments'
import { queueStatusConfig } from '@/app/dentist/_mock/status'

const inputClass = `w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 transition-all ${focusRing}`
const labelClass = 'text-xs font-medium text-gray-500 mb-1.5 block'

const emptyNote: TreatmentNote = { toothNumber: '', diagnosis: '', treatmentNote: '', nextVisit: '', images: [] }

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
  const [form, setForm] = useState<TreatmentNote>(() => ({
    images: [],
    ...(appointment.treatment ?? emptyNote),
  }))

  const [previewImage, setPreviewImage] = useState<string | null>(null)

  function updateForm<K extends keyof TreatmentNote>(key: K, value: TreatmentNote[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
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

        {appointment.note && (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-3">
            หมายเหตุ: {appointment.note}
          </p>
        )}

        {!isCancelled && (
          <div className="flex flex-wrap gap-2 mt-5">
            <button
              type="button"
              onClick={() => {
                onSaveTreatment(form)
                onComplete?.()
              }}
              className={`px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 ${focusRing}`}
            >
              บันทึกการรักษา
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
