'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { DentistAppointment, TreatmentNote } from '@/components/dentist/types'

type QueueContextValue = {
  appointments: DentistAppointment[]
  isLoading: boolean
  error: string
  startTreatment: (id: string) => Promise<void>
  saveTreatment: (id: string, note: TreatmentNote) => Promise<void>
  completeAppointment: (id: string) => Promise<void>
}

const QueueContext = createContext<QueueContextValue | null>(null)

export function QueueProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<DentistAppointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/appointments')
      .then((res) => res.json())
      .then((data: { appointments?: DentistAppointment[]; error?: string }) => {
        if (data.appointments) setAppointments(data.appointments)
        else setError(data.error ?? 'โหลดข้อมูลนัดหมายไม่สำเร็จ')
      })
      .catch(() => setError('โหลดข้อมูลนัดหมายไม่สำเร็จ'))
      .finally(() => setIsLoading(false))
  }, [])

  const updateStatus = useCallback(async (id: string, status: 'IN_TREATMENT' | 'COMPLETED') => {
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) return
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
  }, [])

  const startTreatment = useCallback((id: string) => updateStatus(id, 'IN_TREATMENT'), [updateStatus])
  const completeAppointment = useCallback((id: string) => updateStatus(id, 'COMPLETED'), [updateStatus])

  const saveTreatment = useCallback(async (id: string, note: TreatmentNote) => {
    const res = await fetch(`/api/appointments/${id}/treatment`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    })
    if (!res.ok) return
    const data = await res.json()
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, treatment: data.treatment } : a)))
  }, [])

  return (
    <QueueContext.Provider value={{ appointments, isLoading, error, startTreatment, saveTreatment, completeAppointment }}>
      {children}
    </QueueContext.Provider>
  )
}

export function useQueue() {
  const ctx = useContext(QueueContext)
  if (!ctx) throw new Error('useQueue must be used within QueueProvider')
  return ctx
}
