export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'WAITING' | 'IN_TREATMENT' | 'COMPLETED' | 'CANCELLED'
export type RequestType = 'CANCEL' | 'RESCHEDULE'
export type PaymentStatus = 'UNPAID' | 'PAID'

export type AdminAppointmentAddOn = { id: string; serviceId: string | null; serviceName: string; quantity: number; unitPrice: number }

export type AdminAppointmentTreatment = {
  servicePrice?: number | null
  addOns?: AdminAppointmentAddOn[]
  paymentStatus: PaymentStatus
  paidAt: string | null
  nextVisit?: string | null
  nextVisitNote?: string | null
}

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
  serviceMinPrice: number
  serviceMaxPrice: number
  durationMin: number
  dentistId: string | null
  dentistName: string | null
  requestType: RequestType | null
  requestReason: string | null
  requestedAt: string | null
  treatment?: AdminAppointmentTreatment
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
