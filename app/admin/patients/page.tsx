'use client'

import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SearchBar } from '@/components/admin/SearchBar'
import { StatusBadge, type StatusTone } from '@/components/admin/StatusBadge'
import { StatCard } from '@/components/admin/StatCard'
import { PatientDrawer, type PatientFormValues } from '@/components/admin/PatientDrawer'
import { IconUsers, IconUserCheck, IconClock, IconPlus } from '@/components/admin/icons'
import type { AdminPatient, RecallStatus } from './types'
import { focusRing } from '@/lib/admin/focus-ring'

const recallConfig: Record<RecallStatus, { label: string; tone: StatusTone }> = {
  ON_TRACK: { label: 'ปกติ', tone: 'blue' },
  DUE_SOON: { label: 'ถึงกำหนดตรวจ', tone: 'amber' },
  OVERDUE: { label: 'เกินกำหนด', tone: 'rose' },
  NEW: { label: 'คนไข้ใหม่', tone: 'sky' },
}

const sourceConfig = {
  ONLINE: { label: 'ออนไลน์', tone: 'blue' as StatusTone },
  WALK_IN: { label: 'Walk-in', tone: 'sky' as StatusTone },
}

type FilterId = 'ALL' | 'DUE' | 'NEW' | 'ONLINE' | 'WALK_IN'

const filterTabs: { id: FilterId; label: string }[] = [
  { id: 'ALL', label: 'ทั้งหมด' },
  { id: 'DUE', label: 'ถึงกำหนดตรวจ' },
  { id: 'NEW', label: 'คนไข้ใหม่' },
  { id: 'ONLINE', label: 'ออนไลน์' },
  { id: 'WALK_IN', label: 'Walk-in' },
]

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso + 'T00:00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}

type DrawerState =
  | { open: false }
  | { open: true; mode: 'create' }
  | { open: true; mode: 'edit'; patient: AdminPatient }

export default function AdminPatients() {
  const [patients, setPatients] = useState<AdminPatient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<FilterId>('ALL')
  const [drawer, setDrawer] = useState<DrawerState>({ open: false })
  const [formError, setFormError] = useState('')

  const now = useMemo(() => new Date(), [])

  useEffect(() => {
    fetch('/api/patients')
      .then((res) => res.json())
      .then((data: { patients?: AdminPatient[] }) => setPatients(data.patients ?? []))
      .finally(() => setIsLoading(false))
  }, [])

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase()
      if (searchTerm.trim() && !fullName.includes(searchTerm.trim().toLowerCase()) && !(p.phone ?? '').includes(searchTerm.trim())) {
        return false
      }
      if (filter === 'DUE' && p.recallStatus !== 'DUE_SOON' && p.recallStatus !== 'OVERDUE') return false
      if (filter === 'NEW' && p.recallStatus !== 'NEW') return false
      if (filter === 'ONLINE' && p.source !== 'ONLINE') return false
      if (filter === 'WALK_IN' && p.source !== 'WALK_IN') return false
      return true
    })
  }, [patients, searchTerm, filter])

  const stats = useMemo(() => {
    const newThisMonth = patients.filter((p) => {
      const d = new Date(p.registeredDate + 'T00:00:00')
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length
    const dueRecall = patients.filter((p) => p.recallStatus === 'DUE_SOON' || p.recallStatus === 'OVERDUE').length
    return { total: patients.length, newThisMonth, dueRecall }
  }, [patients, now])

  async function handleSubmit(values: PatientFormValues) {
    setFormError('')
    try {
      if (drawer.open && drawer.mode === 'edit') {
        const id = drawer.patient.id
        const res = await fetch(`/api/patients/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })
        const data = await res.json()
        if (!res.ok) {
          setFormError(data.error ?? 'บันทึกไม่สำเร็จ')
          return
        }
        setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...data.patient } : p)))
      } else {
        const res = await fetch('/api/patients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })
        const data = await res.json()
        if (!res.ok) {
          setFormError(data.error ?? 'บันทึกไม่สำเร็จ')
          return
        }
        setPatients((prev) => [data.patient, ...prev])
      }
      setDrawer({ open: false })
    } catch {
      setFormError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    }
  }

  return (
    <>
      <PageHeader
        title="คนไข้"
        subtitle={`${patients.length} คนไข้ทั้งหมด`}
        actions={
          <button
            type="button"
            onClick={() => setDrawer({ open: true, mode: 'create' })}
            className={`flex items-center gap-2 px-3.5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 ${focusRing}`}
          >
            <IconPlus className="w-4 h-4" />
            เพิ่มคนไข้ Walk-in
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="คนไข้ทั้งหมด" value={stats.total} icon={IconUsers} />
        <StatCard label="คนไข้ใหม่เดือนนี้" value={stats.newThisMonth} icon={IconUserCheck} />
        <StatCard label="ถึงกำหนดตรวจ" value={stats.dueRecall} icon={IconClock} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">รายชื่อคนไข้</h2>
              <p className="text-xs text-gray-400 mt-0.5">Patient roster</p>
            </div>
            <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="ค้นหาชื่อหรือเบอร์โทร..." />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${focusRing} ${
                  filter === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-500 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-400 text-center py-10">กำลังโหลดรายชื่อคนไข้...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <th className="px-6 py-3 font-medium">คนไข้</th>
                  <th className="px-6 py-3 font-medium">เบอร์โทร</th>
                  <th className="px-6 py-3 font-medium">ประเภท</th>
                  <th className="px-6 py-3 font-medium">นัดล่าสุด</th>
                  <th className="px-6 py-3 font-medium">นัดถัดไป</th>
                  <th className="px-6 py-3 font-medium">สถานะตรวจ</th>
                  <th className="px-6 py-3 font-medium">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-semibold shrink-0">
                          {p.firstName.charAt(0)}
                        </div>
                        <span className="text-gray-800">{p.firstName} {p.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{p.phone ?? '—'}</td>
                    <td className="px-6 py-4">
                      <StatusBadge label={sourceConfig[p.source].label} tone={sourceConfig[p.source].tone} />
                    </td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(p.lastVisitDate)}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {p.nextAppointmentDate ? `${formatDate(p.nextAppointmentDate)} · ${p.nextAppointmentLabel}` : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge label={recallConfig[p.recallStatus].label} tone={recallConfig[p.recallStatus].tone} />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => setDrawer({ open: true, mode: 'edit', patient: p })}
                        className={`text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs font-medium transition px-2 py-1.5 rounded-md ${focusRing}`}
                      >
                        ดูรายละเอียด
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-400">ไม่พบคนไข้ที่ตรงกับเงื่อนไข</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-6 py-3 border-t border-gray-50">
          <p className="text-xs text-gray-400">แสดง {filteredPatients.length} จาก {patients.length} รายการ</p>
        </div>
      </div>

      <PatientDrawer
        open={drawer.open}
        mode={drawer.open ? drawer.mode : 'create'}
        patient={drawer.open && drawer.mode === 'edit' ? drawer.patient : undefined}
        error={formError}
        onClose={() => {
          setFormError('')
          setDrawer({ open: false })
        }}
        onSubmit={handleSubmit}
      />
    </>
  )
}
