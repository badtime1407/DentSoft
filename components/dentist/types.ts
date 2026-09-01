export type AppointmentStatus = 'CONFIRMED' | 'WAITING' | 'IN_TREATMENT' | 'COMPLETED' | 'CANCELLED'

export type TreatmentImageRef = { id: string; url: string }

export type TreatmentNote = {
  toothNumber: string
  diagnosis: string
  treatmentItems: string[]
  nextVisit: string
  images?: TreatmentImageRef[]
}

export type DentistAppointment = {
  id: string
  date: string
  time: string
  patientId: string
  patientName: string
  patientAge: number
  patientPhone: string
  serviceName: string
  durationMin: number
  status: AppointmentStatus
  note?: string | null
  treatment?: TreatmentNote
}

export type PastVisit = {
  date: string
  serviceName: string
  toothNumber?: string
  diagnosis?: string
  treatmentNote?: string
  images?: TreatmentImageRef[]
}
