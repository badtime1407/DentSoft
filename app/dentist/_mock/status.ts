import type { StatusTone } from '@/components/shared/StatusBadge'
import type { AppointmentStatus } from './appointments'

export const statusConfig: Record<AppointmentStatus, { label: string; tone: StatusTone }> = {
  CONFIRMED: { label: 'ยืนยันแล้ว', tone: 'sky' },
  WAITING: { label: 'รอคิว', tone: 'amber' },
  IN_TREATMENT: { label: 'กำลังรักษา', tone: 'cyan' },
  COMPLETED: { label: 'เสร็จสิ้น', tone: 'blue' },
  CANCELLED: { label: 'ยกเลิก', tone: 'rose' },
}

// สำหรับหน้าบันทึกการรักษา: แสดงแค่ 3 สถานะ — รอคิว (รวม CONFIRMED/IN_TREATMENT), เสร็จสิ้น, ยกเลิก
export const queueStatusConfig: Record<AppointmentStatus, { label: string; tone: StatusTone }> = {
  CONFIRMED: statusConfig.WAITING,
  WAITING: statusConfig.WAITING,
  IN_TREATMENT: statusConfig.WAITING,
  COMPLETED: statusConfig.COMPLETED,
  CANCELLED: statusConfig.CANCELLED,
}

export type UrgencyLevel = 'NORMAL' | 'ATTENTION' | 'URGENT'

export const urgencyConfig: Record<UrgencyLevel, { label: string; badge: string; text: string }> = {
  NORMAL: { label: 'ปกติ', badge: 'bg-slate-100 text-slate-600', text: 'text-slate-500' },
  ATTENTION: { label: 'ควรดูแล', badge: 'bg-amber-50 text-amber-700', text: 'text-amber-700' },
  URGENT: { label: 'รอนาน', badge: 'bg-rose-50 text-rose-700', text: 'text-rose-700' },
}

export function urgencyOf(waitMinutes: number): UrgencyLevel {
  if (waitMinutes >= 25) return 'URGENT'
  if (waitMinutes >= 12) return 'ATTENTION'
  return 'NORMAL'
}
