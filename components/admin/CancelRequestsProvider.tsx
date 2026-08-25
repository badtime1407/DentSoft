'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

export type CancelRequestType = 'CANCEL' | 'RESCHEDULE'

export type CancelRequest = {
  id: string
  appointmentId: string
  patientName: string
  date: string
  startTime: string
  serviceName: string
  dentistName: string
  type: CancelRequestType
  reason: string
  requestedAt: string
}

type CancelRequestsContextValue = {
  requests: CancelRequest[]
  resolveRequestByAppointment: (appointmentId: string) => void
}

const CancelRequestsContext = createContext<CancelRequestsContextValue | null>(null)

export function CancelRequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<CancelRequest[]>([])

  useEffect(() => {
    fetch('/api/appointments/requests')
      .then((res) => res.json())
      .then((data: { requests?: CancelRequest[] }) => setRequests(data.requests ?? []))
  }, [])

  const resolveRequestByAppointment = useCallback((appointmentId: string) => {
    setRequests((prev) => prev.filter((r) => r.appointmentId !== appointmentId))
  }, [])

  return (
    <CancelRequestsContext.Provider value={{ requests, resolveRequestByAppointment }}>
      {children}
    </CancelRequestsContext.Provider>
  )
}

export function useCancelRequests() {
  const ctx = useContext(CancelRequestsContext)
  if (!ctx) throw new Error('useCancelRequests must be used within CancelRequestsProvider')
  return ctx
}
