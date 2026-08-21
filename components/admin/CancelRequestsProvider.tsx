'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { buildMockCancelRequests, type CancelRequest } from '@/app/admin/_mock/cancel-requests'

type CancelRequestsContextValue = {
  requests: CancelRequest[]
  resolveRequestByAppointment: (appointmentId: string) => void
}

const CancelRequestsContext = createContext<CancelRequestsContextValue | null>(null)

export function CancelRequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<CancelRequest[]>(() => buildMockCancelRequests())

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
