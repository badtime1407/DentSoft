'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQueue } from '@/components/dentist/QueueProvider'
import { PageHeader } from '@/components/shared/PageHeader'
import { PatientQueueList } from '@/components/dentist/PatientQueueList'
import { TreatmentPanel } from '@/components/dentist/TreatmentPanel'
import { SkeletonListRows, Skeleton } from '@/components/shared/Skeleton'
import type { PastVisit, TreatmentPlanSummary } from '@/components/dentist/types'

function todayInBangkok() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Bangkok' })
}

export default function DentistTreatment() {
  const { appointments, isLoading, startTreatment, completeAppointment, saveTreatment } = useQueue()
  const searchParams = useSearchParams()
  const idParam = searchParams.get('id')
  const today = useMemo(() => todayInBangkok(), [])

  // รายการทางซ้ายแสดงเฉพาะคิววันนี้ที่ยังไม่เสร็จสิ้น — งานของทันตแพทย์ ณ ตอนนี้
  const sorted = useMemo(
    () =>
      appointments
        .filter((a) => a.date === today && a.status !== 'COMPLETED')
        .sort((a, b) => a.time.localeCompare(b.time)),
    [appointments, today]
  )

  const defaultId = useMemo(() => {
    return (
      sorted.find((a) => a.status === 'WAITING')?.id ??
      sorted.find((a) => a.status === 'IN_TREATMENT')?.id ??
      sorted.find((a) => a.status === 'CONFIRMED')?.id ??
      sorted[0]?.id ??
      ''
    )
  }, [sorted])

  const selectedId = idParam ?? defaultId
  // ค้นหาจากทุกวัน เพื่อรองรับการเปิดนัดหมายวันอื่นจากปฏิทินในหน้านัดหมาย
  const selected = appointments.find((a) => a.id === selectedId)

  const [history, setHistory] = useState<PastVisit[]>([])
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlanSummary[]>([])
  const [currentDentistId, setCurrentDentistId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/dentist/me')
      .then((res) => res.json())
      .then((data: { id?: string }) => setCurrentDentistId(data.id ?? null))
      .catch(() => setCurrentDentistId(null))
  }, [])

  function refetchPatientData() {
    if (!selected) return
    fetch(`/api/patients/${selected.patientId}?excludeAppointmentId=${selected.id}`)
      .then((res) => res.json())
      .then((data: { history?: PastVisit[]; treatmentPlans?: TreatmentPlanSummary[] }) => {
        setHistory(data.history ?? [])
        setTreatmentPlans(data.treatmentPlans ?? [])
      })
      .catch(() => {
        setHistory([])
        setTreatmentPlans([])
      })
  }

  useEffect(() => {
    if (!selected) {
      setHistory([])
      setTreatmentPlans([])
      return
    }
    refetchPatientData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  async function handleCreatePlan(title: string, steps: string[]) {
    if (!selected) return
    const res = await fetch('/api/treatment-plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId: selected.patientId, title, steps }),
    })
    if (res.ok) refetchPatientData()
  }

  async function handleAddPlanStep(planId: string, description: string) {
    const res = await fetch(`/api/treatment-plans/${planId}/steps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description }),
    })
    if (res.ok) refetchPatientData()
  }

  async function handleToggleStep(planId: string, stepId: string, isDone: boolean) {
    const res = await fetch(`/api/treatment-plans/${planId}/steps/${stepId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isDone }),
    })
    if (res.ok) refetchPatientData()
  }

  async function handleUpdateStep(planId: string, stepId: string, description: string) {
    const res = await fetch(`/api/treatment-plans/${planId}/steps/${stepId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description }),
    })
    if (res.ok) refetchPatientData()
  }

  async function handleDeleteStep(planId: string, stepId: string) {
    const res = await fetch(`/api/treatment-plans/${planId}/steps/${stepId}`, { method: 'DELETE' })
    if (res.ok) refetchPatientData()
  }

  async function handleDeletePlan(planId: string) {
    const res = await fetch(`/api/treatment-plans/${planId}`, { method: 'DELETE' })
    if (res.ok) refetchPatientData()
  }

  return (
    <>
      <PageHeader title="บันทึกการรักษา" subtitle="เลือกคนไข้จากรายการเพื่อดูรายละเอียดและบันทึกการรักษา" />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-fit">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">คิววันนี้</h2>
          </div>
          {isLoading ? <SkeletonListRows rows={4} /> : <PatientQueueList appointments={sorted} selectedId={selectedId} />}
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          </div>
        ) : selected ? (
          <TreatmentPanel
            key={selected.id}
            appointment={selected}
            history={history}
            treatmentPlans={treatmentPlans}
            currentDentistId={currentDentistId}
            onStart={() => startTreatment(selected.id)}
            onComplete={() => completeAppointment(selected.id)}
            onSaveTreatment={(note) => saveTreatment(selected.id, note)}
            onCreatePlan={handleCreatePlan}
            onAddPlanStep={handleAddPlanStep}
            onToggleStep={handleToggleStep}
            onUpdateStep={handleUpdateStep}
            onDeleteStep={handleDeleteStep}
            onDeletePlan={handleDeletePlan}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-sm text-gray-400">
            ไม่มีนัดหมายวันนี้
          </div>
        )}
      </div>
    </>
  )
}
