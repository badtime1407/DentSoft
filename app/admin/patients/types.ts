export type RecallStatus = 'ON_TRACK' | 'DUE_SOON' | 'OVERDUE' | 'NEW'
export type PatientSource = 'ONLINE' | 'WALK_IN'

export type AdminPatient = {
  id: string
  firstName: string
  lastName: string
  phone: string | null
  birthDate: string | null
  source: PatientSource
  allergyNote: string | null
  registeredDate: string
  lastVisitDate: string | null
  nextAppointmentDate: string | null
  nextAppointmentLabel: string | null
  recallStatus: RecallStatus
}
