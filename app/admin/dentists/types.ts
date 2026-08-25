import type { Specialty } from '@/app/admin/_mock/reference'

export type DaySchedule = { active: boolean; startTime: string; endTime: string }
export type WeeklySchedule = DaySchedule[] // length 7, index 0=Sun .. 6=Sat

export type AdminDentist = {
  id: string
  title: string
  firstName: string
  lastName: string
  specialty: Specialty
  phone: string
  schedule: WeeklySchedule
  bookedToday: number
}
