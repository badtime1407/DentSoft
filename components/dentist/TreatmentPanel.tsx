/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { IconPhone, IconFileText, IconImageIcon, IconUpload, IconX, IconPlus, IconAlertTriangle } from '@/components/shared/icons'
import { focusRing } from '@/lib/shared/focus-ring'
import type { DentistAppointment, PastVisit, TreatmentNote } from '@/components/dentist/types'
import { queueStatusConfig } from '@/lib/dentist/status-config'

type AddOnCatalogItem = { id: string; name: string; minPrice: number; maxPrice: number }

const inputClass = `w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 transition-all ${focusRing}`
const labelClass = 'text-xs font-medium text-gray-500 mb-1.5 block'
const chipClass = `px-2.5 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[11px] font-medium rounded-full border border-slate-200 transition ${focusRing}`

const emptyNote: TreatmentNote = { toothNumber: '', diagnosis: '', servicePrice: null, treatmentItems: [], nextVisit: '', images: [], addOns: [] }

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
    if (appointment.treatment) {
      return {
        images: [], addOns: [], ...appointment.treatment,
        servicePrice: appointment.treatment.servicePrice ?? appointment.serviceMinPrice,
      }
    }
    const template = serviceTemplates[appointment.serviceName]
    const base = template ? { ...emptyNote, diagnosis: template.diagnosis, treatmentItems: template.treatmentItems } : emptyNote
    return { ...base, servicePrice: appointment.serviceMinPrice }
  })

  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [imageError, setImageError] = useState('')

  const [addOnCatalog, setAddOnCatalog] = useState<AddOnCatalogItem[]>([])
  const [addOnPickerOpen, setAddOnPickerOpen] = useState(false)
  const [customAddOnName, setCustomAddOnName] = useState('')
  const [customAddOnPrice, setCustomAddOnPrice] = useState('')

  useEffect(() => {
    fetch('/api/services?type=ADD_ON')
      .then((res) => res.json())
      .then((data: { services?: AddOnCatalogItem[] }) => setAddOnCatalog(data.services ?? []))
      .catch(() => setAddOnCatalog([]))
  }, [])

  function addAddOn(service: AddOnCatalogItem) {
    setForm((prev) => {
      const existing = prev.addOns ?? []
      if (existing.some((a) => a.serviceId === service.id)) return prev
      return {
        ...prev,
        addOns: [...existing, { serviceId: service.id, serviceName: service.name, quantity: 1, unitPrice: service.minPrice }],
      }
    })
    setAddOnPickerOpen(false)
  }

  function updateAddOnQuantity(index: number, quantity: number) {
    setForm((prev) => ({
      ...prev,
      addOns: (prev.addOns ?? []).map((a, i) => (i === index ? { ...a, quantity: Math.max(1, Math.floor(quantity) || 1) } : a)),
    }))
  }

  function updateAddOnPrice(index: number, unitPrice: number) {
    setForm((prev) => ({
      ...prev,
      addOns: (prev.addOns ?? []).map((a, i) => (i === index ? { ...a, unitPrice: Math.max(0, unitPrice || 0) } : a)),
    }))
  }

  function removeAddOn(index: number) {
    setForm((prev) => ({ ...prev, addOns: (prev.addOns ?? []).filter((_, i) => i !== index) }))
  }

  function addCustomAddOn() {
    const name = customAddOnName.trim()
    const price = Number(customAddOnPrice)
    if (!name || !Number.isFinite(price) || price < 0) return
    setForm((prev) => ({
      ...prev,
      addOns: [...(prev.addOns ?? []), { serviceId: null, serviceName: name, quantity: 1, unitPrice: price }],
    }))
    setCustomAddOnName('')
    setCustomAddOnPrice('')
    setAddOnPickerOpen(false)
  }

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

  function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => resolve(event.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    e.target.value = ''

    setImageError('')
    setIsUploadingImage(true)
    try {
      for (const file of Array.from(files)) {
        const dataUrl = await readFileAsDataUrl(file)
        const res = await fetch(`/api/appointments/${appointment.id}/treatment/images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: dataUrl }),
        })
        const data = await res.json()
        if (!res.ok) {
          setImageError(data.error ?? 'อัปโหลดรูปไม่สำเร็จ')
          continue
        }
        setForm((prev) => ({ ...prev, images: [...(prev.images || []), { id: data.id, url: data.url }] }))
      }
    } finally {
      setIsUploadingImage(false)
    }
  }

  async function removeImage(imageId: string) {
    setImageError('')
    const res = await fetch(`/api/appointments/${appointment.id}/treatment/images/${imageId}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json()
      setImageError(data.error ?? 'ลบรูปไม่สำเร็จ')
      return
    }
    setForm((prev) => ({ ...prev, images: (prev.images || []).filter((img) => img.id !== imageId) }))
  }

  const isCancelled = appointment.status === 'CANCELLED'
  const servicePriceIsEditable = appointment.serviceMinPrice !== appointment.serviceMaxPrice
  const servicePrice = form.servicePrice ?? appointment.serviceMinPrice
  const addOnsTotal = (form.addOns ?? []).reduce((sum, a) => sum + a.quantity * a.unitPrice, 0)
  const grandTotal = servicePrice + addOnsTotal

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

        {appointment.patientAllergyNote ? (
          <div className="flex items-start gap-2 mt-4 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
            <IconAlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-semibold text-rose-700">ประวัติแพ้ยา / ข้อควรระวัง</p>
              <p className="text-sm text-rose-800 mt-0.5">{appointment.patientAllergyNote}</p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-400 mt-4">ไม่มีประวัติแพ้ยา/ข้อควรระวังในระบบ</p>
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
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold text-blue-700 mb-0.5">สิ่งที่คนไข้จองมา</p>
                <p className="text-sm font-medium text-slate-800">{appointment.serviceName}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[11px] text-blue-700 mb-0.5">ราคาค่าบริการ</p>
                {servicePriceIsEditable ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={appointment.serviceMinPrice}
                      max={appointment.serviceMaxPrice}
                      value={servicePrice}
                      onChange={(e) => updateForm('servicePrice', Number(e.target.value))}
                      disabled={isCancelled}
                      className="w-24 px-2 py-1 rounded-md border border-blue-200 text-sm text-slate-800 text-right tabular-nums disabled:opacity-50"
                    />
                    <span className="text-xs text-slate-500">บาท</span>
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-slate-800 tabular-nums">฿{servicePrice.toLocaleString('th-TH')}</p>
                )}
              </div>
            </div>
            {appointment.note && <p className="text-xs text-slate-500 mt-2">หมายเหตุจากคนไข้: {appointment.note}</p>}
          </div>

          <fieldset disabled={isCancelled} className="space-y-4 disabled:opacity-50">
            <div>
              <label className={labelClass}>ฟันที่รักษา (ถ้ามี)</label>
              <input className={inputClass} value={form.toothNumber} onChange={(e) => updateForm('toothNumber', e.target.value)} />
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
            <div className="pt-2 border-t border-slate-100">
              <label className={labelClass}>อุปกรณ์/บริการเพิ่มเติม</label>
              <div className="space-y-2">
                {(form.addOns ?? []).map((addOn, idx) => {
                  const catalogItem = addOn.serviceId ? addOnCatalog.find((s) => s.id === addOn.serviceId) : undefined
                  const priceIsEditable = !addOn.serviceId || (catalogItem ? catalogItem.minPrice !== catalogItem.maxPrice : true)
                  return (
                    <div key={addOn.serviceId ?? `custom-${idx}`} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                      <span className="flex-1 text-sm text-gray-700 truncate">{addOn.serviceName}</span>
                      <input
                        type="number"
                        min={1}
                        value={addOn.quantity}
                        onChange={(e) => updateAddOnQuantity(idx, Number(e.target.value))}
                        className="w-14 px-2 py-1 rounded-md border border-gray-200 text-xs text-gray-700 text-center"
                        title="จำนวน"
                      />
                      {priceIsEditable ? (
                        <input
                          type="number"
                          min={catalogItem?.minPrice}
                          max={catalogItem?.maxPrice}
                          value={addOn.unitPrice}
                          onChange={(e) => updateAddOnPrice(idx, Number(e.target.value))}
                          className="w-20 px-2 py-1 rounded-md border border-gray-200 text-xs text-gray-700 text-right"
                          title="ราคาต่อหน่วย"
                        />
                      ) : (
                        <span className="w-20 text-xs text-gray-500 text-right tabular-nums">฿{addOn.unitPrice.toLocaleString('th-TH')}</span>
                      )}
                      <span className="w-24 text-xs font-semibold text-gray-800 text-right tabular-nums">
                        ฿{(addOn.quantity * addOn.unitPrice).toLocaleString('th-TH')}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAddOn(idx)}
                        className={`shrink-0 p-1.5 rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition ${focusRing}`}
                        title="ลบรายการนี้"
                      >
                        <IconX className="w-4 h-4" />
                      </button>
                    </div>
                  )
                })}
                {(form.addOns ?? []).length === 0 && (
                  <p className="text-xs text-gray-400">ยังไม่มีอุปกรณ์/บริการเพิ่มเติมที่ใช้</p>
                )}
              </div>

              <div className="relative mt-2 inline-block">
                <button type="button" onClick={() => setAddOnPickerOpen((v) => !v)} className={chipClass}>
                  <span className="inline-flex items-center gap-1"><IconPlus className="w-3 h-3" /> เพิ่มรายการ</span>
                </button>
                {addOnPickerOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setAddOnPickerOpen(false)} />
                    <div className="absolute left-0 mt-1 w-72 max-h-80 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg z-20">
                      {addOnCatalog
                        .filter((s) => !(form.addOns ?? []).some((a) => a.serviceId === s.id))
                        .map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => addAddOn(s)}
                            className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition flex items-center justify-between gap-2"
                          >
                            <span className="truncate">{s.name}</span>
                            <span className="shrink-0 text-gray-400 tabular-nums">฿{s.minPrice.toLocaleString('th-TH')}</span>
                          </button>
                        ))}
                      {addOnCatalog.length === 0 && (
                        <p className="px-3 py-2 text-xs text-gray-400">ไม่มีรายการเพิ่มเติมในระบบ</p>
                      )}

                      <div className="border-t border-gray-100 p-2 space-y-1.5" onClick={(e) => e.stopPropagation()}>
                        <p className="text-[11px] font-semibold text-gray-500 px-1">หรือกรอกรายการเอง</p>
                        <input
                          value={customAddOnName}
                          onChange={(e) => setCustomAddOnName(e.target.value)}
                          placeholder="ชื่อรายการ"
                          className="w-full px-2 py-1.5 rounded-md border border-gray-200 text-xs text-gray-700 placeholder:text-gray-400"
                        />
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={0}
                            value={customAddOnPrice}
                            onChange={(e) => setCustomAddOnPrice(e.target.value)}
                            placeholder="ราคา"
                            className="flex-1 px-2 py-1.5 rounded-md border border-gray-200 text-xs text-gray-700 placeholder:text-gray-400"
                          />
                          <button
                            type="button"
                            onClick={addCustomAddOn}
                            disabled={!customAddOnName.trim() || customAddOnPrice === ''}
                            className={`px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-40 transition ${focusRing}`}
                          >
                            เพิ่ม
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
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
                  <label className={`cursor-pointer px-3.5 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${focusRing} ${isUploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                    <IconUpload className="w-4 h-4" />
                    {isUploadingImage ? 'กำลังอัปโหลด...' : 'เพิ่มรูปภาพ / X-Ray'}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isCancelled || isUploadingImage}
                    />
                  </label>
                </div>

                {imageError && <p className="text-xs text-rose-600 font-medium">{imageError}</p>}

                {/* Images Preview Grid */}
                {form.images && form.images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                    {form.images.map((img) => (
                      <div
                        key={img.id}
                        className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm"
                      >
                        <img
                          src={img.url}
                          alt="รูปการรักษา"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                          onClick={() => setPreviewImage(img.url)}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center pointer-events-none">
                          <span className="opacity-0 group-hover:opacity-100 text-white text-[10px] font-bold bg-black/60 px-2 py-0.5 rounded-full transition-opacity">
                            ขยายดู
                          </span>
                        </div>
                        {!isCancelled && (
                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
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

          <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-500 space-y-0.5">
              <p>ค่าบริการ ฿{servicePrice.toLocaleString('th-TH')}{addOnsTotal > 0 && ` + เพิ่มเติม ฿${addOnsTotal.toLocaleString('th-TH')}`}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-gray-400">ยอดรวมทั้งหมด</p>
              <p className="text-lg font-bold text-blue-700 tabular-nums">฿{grandTotal.toLocaleString('th-TH')}</p>
            </div>
          </div>

          {!isCancelled && (
            <div className="flex flex-wrap gap-2 mt-4">
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
                      {v.images.map((img) => (
                        <img
                          key={img.id}
                          src={img.url}
                          alt="Past visit photo"
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 cursor-pointer hover:opacity-80 transition shrink-0"
                          onClick={() => setPreviewImage(img.url)}
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
