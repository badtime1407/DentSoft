export type AppointmentStatus = 'CONFIRMED' | 'WAITING' | 'IN_TREATMENT' | 'COMPLETED' | 'CANCELLED'

export type TreatmentImageRef = { id: string; url: string }

export type TreatmentAddOnRef = {
  serviceId: string | null
  serviceName: string
  quantity: number
  unitPrice: number
}

export type TreatmentNote = {
  toothNumber: string
  diagnosis: string
  servicePrice?: number | null
  treatmentItems: string[]
  nextVisit: string
  nextVisitNote?: string
  images?: TreatmentImageRef[]
  addOns?: TreatmentAddOnRef[]
}

export type DentistAppointment = {
  id: string
  date: string
  time: string
  patientId: string
  patientName: string
  patientAge: number
  patientPhone: string
  patientAllergyNote?: string | null
  serviceName: string
  durationMin: number
  serviceMinPrice: number
  serviceMaxPrice: number
  status: AppointmentStatus
  note?: string | null
  treatment?: TreatmentNote
}

export type TreatmentPlanStep = {
  id: string
  order: number
  description: string
  isDone: boolean
  appointmentId: string | null
  createdByDentistId: string
}

export type TreatmentPlanSummary = {
  id: string
  title: string
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  createdByDentistId: string
  steps: TreatmentPlanStep[]
}

export type PastVisit = {
  date: string
  serviceName: string
  toothNumber?: string
  diagnosis?: string
  treatmentNote?: string
  images?: TreatmentImageRef[]
}
