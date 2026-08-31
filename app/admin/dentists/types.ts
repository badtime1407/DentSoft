import type { AdminServiceOption } from '@/app/admin/appointments/types'

export type DaySchedule = { active: boolean; startTime: string; endTime: string }
export type WeeklySchedule = DaySchedule[] // length 7, index 0=Sun .. 6=Sat

export type AdminDentist = {
  id: string
  title: string
  firstName: string
  lastName: string
  specialty: string | null
  phone: string
  schedule: WeeklySchedule
  bookedToday: number
  services: AdminServiceOption[]
}
