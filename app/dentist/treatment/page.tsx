'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQueue } from '@/components/dentist/QueueProvider'
import { PageHeader } from '@/components/shared/PageHeader'
import { PatientQueueList } from '@/components/dentist/PatientQueueList'
import { TreatmentPanel } from '@/components/dentist/TreatmentPanel'
import type { PastVisit } from '@/components/dentist/types'

function todayInBangkok() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Bangkok' })
}

export default function DentistTreatment() {
  const { appointments, startTreatment, completeAppointment, saveTreatment } = useQueue()
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

  useEffect(() => {
    if (!selected) {
      setHistory([])
      return
    }
    fetch(`/api/patients/${selected.patientId}?excludeAppointmentId=${selected.id}`)
      .then((res) => res.json())
      .then((data: { history?: PastVisit[] }) => setHistory(data.history ?? []))
      .catch(() => setHistory([]))
  }, [selected])

  return (
    <>
      <PageHeader title="บันทึกการรักษา" subtitle="เลือกคนไข้จากรายการเพื่อดูรายละเอียดและบันทึกการรักษา" />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-fit">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">คิววันนี้</h2>
          </div>
          <PatientQueueList appointments={sorted} selectedId={selectedId} />
        </div>

        {selected ? (
          <TreatmentPanel
            key={selected.id}
            appointment={selected}
            history={history}
            onStart={() => startTreatment(selected.id)}
            onComplete={() => completeAppointment(selected.id)}
            onSaveTreatment={(note) => saveTreatment(selected.id, note)}
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
