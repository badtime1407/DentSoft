import type { StatusTone } from '@/components/shared/StatusBadge'
import type { AppointmentStatus } from '@/components/dentist/types'

export const statusConfig: Record<AppointmentStatus, { label: string; tone: StatusTone }> = {
  PENDING: { label: 'รอยืนยัน', tone: 'slate' },
  CONFIRMED: { label: 'ยืนยันแล้ว', tone: 'sky' },
  WAITING: { label: 'รอคิว', tone: 'amber' },
  IN_TREATMENT: { label: 'กำลังรักษา', tone: 'cyan' },
  COMPLETED: { label: 'เสร็จสิ้น', tone: 'blue' },
  CANCELLED: { label: 'ยกเลิก', tone: 'rose' },
}

// สำหรับหน้าบันทึกการรักษา: แสดงแค่ 3 สถานะ — รอคิว (รวม CONFIRMED/IN_TREATMENT), เสร็จสิ้น, ยกเลิก
export const queueStatusConfig: Record<AppointmentStatus, { label: string; tone: StatusTone }> = {
  PENDING: statusConfig.PENDING,
  CONFIRMED: statusConfig.WAITING,
  WAITING: statusConfig.WAITING,
  IN_TREATMENT: statusConfig.WAITING,
  COMPLETED: statusConfig.COMPLETED,
  CANCELLED: statusConfig.CANCELLED,
}
