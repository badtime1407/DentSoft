'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { initialAppointments, type DentistAppointment, type TreatmentNote } from '@/app/dentist/_mock/appointments'

type QueueContextValue = {
  appointments: DentistAppointment[]
  startTreatment: (id: string) => void
  saveTreatment: (id: string, note: TreatmentNote) => void
  completeAppointment: (id: string) => void
}

const QueueContext = createContext<QueueContextValue | null>(null)

export function QueueProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<DentistAppointment[]>(initialAppointments)

  const startTreatment = useCallback((id: string) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'IN_TREATMENT', waitMinutes: undefined } : a)))
  }, [])

  const saveTreatment = useCallback((id: string, note: TreatmentNote) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, treatment: note } : a)))
  }, [])

  const completeAppointment = useCallback((id: string) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'COMPLETED' } : a)))
  }, [])

  return (
    <QueueContext.Provider value={{ appointments, startTreatment, saveTreatment, completeAppointment }}>
      {children}
    </QueueContext.Provider>
  )
}

export function useQueue() {
  const ctx = useContext(QueueContext)
  if (!ctx) throw new Error('useQueue must be used within QueueProvider')
  return ctx
}
