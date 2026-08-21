export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
export type BookingSource = 'ONLINE' | 'PHONE' | 'WALK_IN'

export type ScheduleAppointment = {
  id: string
  date: string
  startTime: string
  durationMin: number
  patientName: string
  patientPhone: string
  serviceId: string
  dentistId: string
  status: BookingStatus
  source: BookingSource
  note?: string
}

export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(base: Date, days: number): Date {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d
}

export function buildMockAppointments(referenceDate: Date = new Date()): ScheduleAppointment[] {
  const d = (offset: number) => toISODate(addDays(referenceDate, offset))
  return [
    { id: 'ap1', date: d(-1), startTime: '09:00', durationMin: 30, patientName: 'อรุณี พงษ์เจริญ', patientPhone: '089-111-2222', serviceId: 'sv1', dentistId: 'dt2', status: 'COMPLETED', source: 'PHONE' },
    { id: 'ap2', date: d(-1), startTime: '10:30', durationMin: 45, patientName: 'กิตติพงษ์ ศรีสุข', patientPhone: '089-222-3333', serviceId: 'sv3', dentistId: 'dt1', status: 'COMPLETED', source: 'WALK_IN' },
    { id: 'ap3', date: d(0), startTime: '08:30', durationMin: 30, patientName: 'สมชาย ใจดี', patientPhone: '089-333-4444', serviceId: 'sv2', dentistId: 'dt1', status: 'CONFIRMED', source: 'PHONE' },
    { id: 'ap4', date: d(0), startTime: '09:30', durationMin: 30, patientName: 'ปิยะดา แสงทอง', patientPhone: '089-444-5555', serviceId: 'sv4', dentistId: 'dt2', status: 'CONFIRMED', source: 'ONLINE' },
    { id: 'ap5', date: d(0), startTime: '10:00', durationMin: 60, patientName: 'ธีรพงศ์ รุ่งเรือง', patientPhone: '089-555-6666', serviceId: 'sv7', dentistId: 'dt1', status: 'CONFIRMED', source: 'PHONE' },
    { id: 'ap6', date: d(0), startTime: '11:00', durationMin: 30, patientName: 'นภัสสร ทองดี', patientPhone: '089-666-7777', serviceId: 'sv9', dentistId: 'dt2', status: 'PENDING', source: 'ONLINE' },
    { id: 'ap7', date: d(0), startTime: '13:00', durationMin: 60, patientName: 'ประสิทธิ์ ดีมาก', patientPhone: '089-777-8888', serviceId: 'sv10', dentistId: 'dt3', status: 'PENDING', source: 'ONLINE' },
    { id: 'ap8', date: d(0), startTime: '14:00', durationMin: 45, patientName: 'วารี ใจงาม', patientPhone: '089-888-9999', serviceId: 'sv3', dentistId: 'dt1', status: 'CANCELLED', source: 'PHONE' },
    { id: 'ap9', date: d(0), startTime: '15:00', durationMin: 30, patientName: 'รัตนา ชูเกียรติ', patientPhone: '089-999-0000', serviceId: 'sv2', dentistId: 'dt2', status: 'CONFIRMED', source: 'WALK_IN' },
    { id: 'ap10', date: d(1), startTime: '09:00', durationMin: 30, patientName: 'มานี มีสุข', patientPhone: '088-111-2222', serviceId: 'sv9', dentistId: 'dt2', status: 'CONFIRMED', source: 'PHONE' },
    { id: 'ap11', date: d(1), startTime: '10:00', durationMin: 60, patientName: 'ชัยวัฒน์ บุญมี', patientPhone: '088-222-3333', serviceId: 'sv10', dentistId: 'dt3', status: 'PENDING', source: 'ONLINE' },
    { id: 'ap12', date: d(1), startTime: '11:30', durationMin: 30, patientName: 'สุนิสา อินทร์แก้ว', patientPhone: '088-333-4444', serviceId: 'sv1', dentistId: 'dt1', status: 'PENDING', source: 'ONLINE' },
    { id: 'ap13', date: d(1), startTime: '13:30', durationMin: 60, patientName: 'วิชัย เก่งมาก', patientPhone: '088-444-5555', serviceId: 'sv5', dentistId: 'dt3', status: 'CONFIRMED', source: 'WALK_IN' },
    { id: 'ap14', date: d(2), startTime: '09:30', durationMin: 30, patientName: 'สมหญิง รักดี', patientPhone: '088-555-6666', serviceId: 'sv6', dentistId: 'dt1', status: 'CONFIRMED', source: 'PHONE' },
    { id: 'ap15', date: d(2), startTime: '11:00', durationMin: 30, patientName: 'อรุณี พงษ์เจริญ', patientPhone: '089-111-2222', serviceId: 'sv9', dentistId: 'dt2', status: 'PENDING', source: 'ONLINE' },
  ]
}
