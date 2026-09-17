'use client'

import { useEffect, useState } from 'react'
import type { AdminAppointment, AdminAppointmentAddOn } from '@/app/admin/appointments/types'
import { IconX } from './icons'
import { focusRing } from '@/lib/shared/focus-ring'

export function PaymentConfirmModal({
  open,
  appointment,
  onClose,
  onConfirm,
}: {
  open: boolean
  appointment: AdminAppointment | null
  onClose: () => void
  onConfirm: (addOns: { id: string; unitPrice: number }[]) => Promise<void>
}) {
  const [addOns, setAddOns] = useState<AdminAppointmentAddOn[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    setAddOns(appointment?.treatment?.addOns ?? [])
    setIsSubmitting(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, appointment?.id])

  if (!open || !appointment) return null

  function updatePrice(id: string, unitPrice: number) {
    setAddOns((prev) => prev.map((a) => (a.id === id ? { ...a, unitPrice: Math.max(0, unitPrice || 0) } : a)))
  }

  const servicePrice = appointment.treatment?.servicePrice ?? 0
  const addOnsTotal = addOns.reduce((sum, a) => sum + a.quantity * a.unitPrice, 0)
  const grandTotal = servicePrice + addOnsTotal
  const hasUnpriced = addOns.some((a) => a.unitPrice <= 0)

  async function handleConfirm() {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await onConfirm(addOns.map((a) => ({ id: a.id, unitPrice: a.unitPrice })))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-semibold text-gray-900">ยืนยันรับชำระเงิน</h2>
            <p className="text-xs text-gray-400 mt-0.5">{appointment.patientName}</p>
          </div>
          <button type="button" onClick={onClose} className={`p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition ${focusRing}`}>
            <IconX className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
            <span className="text-sm text-gray-700">{appointment.serviceName}</span>
            <span className="text-sm font-semibold text-gray-800 tabular-nums">฿{servicePrice.toLocaleString('th-TH')}</span>
          </div>

          {addOns.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500">อุปกรณ์/บริการเพิ่มเติม</p>
              {addOns.map((a) => (
                <div key={a.id} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                  <span className="flex-1 text-sm text-gray-700 truncate">
                    {a.serviceName} {a.quantity > 1 && <span className="text-gray-400">× {a.quantity}</span>}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs text-gray-400">฿</span>
                    <input
                      type="number"
                      min={0}
                      value={a.unitPrice}
                      onChange={(e) => updatePrice(a.id, Number(e.target.value))}
                      className={`w-20 px-2 py-1 rounded-md border text-xs text-gray-700 text-right ${
                        a.unitPrice <= 0 ? 'border-amber-300 bg-amber-50' : 'border-gray-200'
                      }`}
                      title="ราคาต่อหน่วย"
                    />
                  </div>
                  <span className="w-20 text-xs font-semibold text-gray-800 text-right tabular-nums">
                    ฿{(a.quantity * a.unitPrice).toLocaleString('th-TH')}
                  </span>
                </div>
              ))}
              {hasUnpriced && <p className="text-[11px] text-amber-600">กรุณาระบุราคาให้ครบทุกรายการก่อนยืนยัน</p>}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-sm text-gray-500">ยอดรวมทั้งหมด</span>
            <span className="text-lg font-bold text-blue-700 tabular-nums">฿{grandTotal.toLocaleString('th-TH')}</span>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 shrink-0">
          <button
            type="button"
            disabled={isSubmitting || hasUnpriced}
            onClick={handleConfirm}
            className={`w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${focusRing}`}
          >
            {isSubmitting ? 'กำลังบันทึก...' : 'ยืนยันชำระเงินเสร็จสิ้น'}
          </button>
        </div>
      </div>
    </div>
  )
}
