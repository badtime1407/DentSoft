export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'WAITING' | 'IN_TREATMENT' | 'COMPLETED' | 'CANCELLED'
export type RequestType = 'CANCEL' | 'RESCHEDULE'

export type AdminAppointment = {
  id: string
  date: string // ISO datetime
  status: BookingStatus
  updatedAt: string
  note: string | null
  patientId: string
  patientName: string
  patientPhone: string | null
  serviceId: string
  serviceName: string
  durationMin: number
  dentistId: string | null
  dentistName: string | null
  requestType: RequestType | null
  requestReason: string | null
  requestedAt: string | null
}

export type AdminServiceOption = {
  id: string
  name: string
  minPrice: number
  maxPrice: number
  duration: number | null
}

export type AdminDentistOption = {
  id: string
  name: string
  specialty: string | null
  startTime: string
  endTime: string
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
