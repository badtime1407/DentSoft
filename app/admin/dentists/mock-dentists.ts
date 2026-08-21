import type { Specialty } from '@/app/admin/_mock/reference'

export type DaySchedule = { active: boolean; startTime: string; endTime: string }
export type WeeklySchedule = DaySchedule[] // length 7, index 0=Sun .. 6=Sat

export type MockDentist = {
  id: string
  name: string
  specialty: Specialty
  phone: string
  schedule: WeeklySchedule
  bookedToday: number
}

function day(active: boolean, startTime = '09:00', endTime = '17:00'): DaySchedule {
  return { active, startTime, endTime }
}

export const mockDentists: MockDentist[] = [
  {
    id: 'dt1',
    name: 'ทพ. วิชัย เก่งกล้า',
    specialty: 'ทันตกรรมทั่วไป',
    phone: '081-234-5671',
    schedule: [
      day(false), // อา
      day(true, '08:00', '17:00'), // จ
      day(true, '08:00', '17:00'), // อ
      day(true, '08:00', '17:00'), // พ
      day(true, '08:00', '17:00'), // พฤ
      day(true, '08:00', '17:00'), // ศ
      day(true, '08:00', '14:00'), // ส
    ],
    bookedToday: 6,
  },
  {
    id: 'dt2',
    name: 'ทพญ. สมหญิง รักดี',
    specialty: 'ทันตกรรมจัดฟัน',
    phone: '081-234-5672',
    schedule: [
      day(false),
      day(true, '09:00', '18:00'),
      day(true, '09:00', '18:00'),
      day(true, '09:00', '18:00'),
      day(true, '09:00', '18:00'),
      day(true, '09:00', '18:00'),
      day(true, '09:00', '14:00'),
    ],
    bookedToday: 5,
  },
  {
    id: 'dt3',
    name: 'ทพ. อนันต์ พงศ์ไพบูลย์',
    specialty: 'ศัลยกรรมช่องปาก',
    phone: '081-234-5673',
    schedule: [
      day(false),
      day(false),
      day(true, '11:00', '19:00'),
      day(false),
      day(true, '11:00', '19:00'),
      day(false),
      day(true, '11:00', '19:00'),
    ],
    bookedToday: 3,
  },
]
