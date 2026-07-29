'use client'

import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SearchBar } from '@/components/admin/SearchBar'
import { StatusBadge, type StatusTone } from '@/components/admin/StatusBadge'
import { StatCard } from '@/components/admin/StatCard'
import { PatientDrawer, type PatientFormValues } from '@/components/admin/PatientDrawer'
import { IconUsers, IconUserCheck, IconClock, IconWallet, IconPlus } from '@/components/admin/icons'
import { buildMockPatients, type MockPatient, type RecallStatus } from './mock-patients'
import { focusRing } from '@/lib/admin/focus-ring'

const recallConfig: Record<RecallStatus, { label: string; tone: StatusTone }> = {
  ON_TRACK: { label: 'ปกติ', tone: 'emerald' },
  DUE_SOON: { label: 'ถึงกำหนดตรวจ', tone: 'amber' },
  OVERDUE: { label: 'เกินกำหนด', tone: 'rose' },
  NEW: { label: 'คนไข้ใหม่', tone: 'sky' },
}

type FilterId = 'ALL' | 'DUE' | 'BALANCE' | 'NEW'

const filterTabs: { id: FilterId; label: string }[] = [
  { id: 'ALL', label: 'ทั้งหมด' },
  { id: 'DUE', label: 'ถึงกำหนดตรวจ' },
  { id: 'BALANCE', label: 'ค้างชำระ' },
  { id: 'NEW', label: 'คนไข้ใหม่' },
]

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso + 'T00:00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}

type DrawerState =
  | { open: false }
  | { open: true; mode: 'create' }
  | { open: true; mode: 'edit'; patient: MockPatient }

export default function AdminPatients() {
  const [patients, setPatients] = useState<MockPatient[]>(() => buildMockPatients())
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<FilterId>('ALL')
  const [drawer, setDrawer] = useState<DrawerState>({ open: false })

  const now = useMemo(() => new Date(), [])

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase()
      if (searchTerm.trim() && !fullName.includes(searchTerm.trim().toLowerCase()) && !p.phone.includes(searchTerm.trim())) {
        return false
      }
      if (filter === 'DUE' && p.recallStatus !== 'DUE_SOON' && p.recallStatus !== 'OVERDUE') return false
      if (filter === 'BALANCE' && p.balance <= 0) return false
      if (filter === 'NEW' && p.recallStatus !== 'NEW') return false
      return true
    })
  }, [patients, searchTerm, filter])

  const stats = useMemo(() => {
    const newThisMonth = patients.filter((p) => {
      const d = new Date(p.registeredDate + 'T00:00:00')
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length
    const dueRecall = patients.filter((p) => p.recallStatus === 'DUE_SOON' || p.recallStatus === 'OVERDUE').length
    const withBalance = patients.filter((p) => p.balance > 0).length
    return { total: patients.length, newThisMonth, dueRecall, withBalance }
  }, [patients, now])

  function handleSubmit(values: PatientFormValues) {
    if (drawer.open && drawer.mode === 'edit') {
      const id = drawer.patient.id
      setPatients((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, firstName: values.firstName, lastName: values.lastName, phone: values.phone, birthDate: values.birthDate, allergyNote: values.allergyNote || null }
            : p
        )
      )
    } else {
      const today = new Date().toISOString().slice(0, 10)
      setPatients((prev) => [
        ...prev,
        {
          id: `pt-${Date.now()}`,
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          birthDate: values.birthDate,
          registeredDate: today,
          lastVisitDate: null,
          nextAppointmentDate: null,
          nextAppointmentLabel: null,
          balance: 0,
          allergyNote: values.allergyNote || null,
          recallStatus: 'NEW',
        },
      ])
    }
    setDrawer({ open: false })
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
            className={`flex items-center gap-2 px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200 ${focusRing}`}
          >
            <IconPlus className="w-4 h-4" />
            เพิ่มคนไข้ใหม่
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="คนไข้ทั้งหมด" value={stats.total} icon={IconUsers} />
        <StatCard label="คนไข้ใหม่เดือนนี้" value={stats.newThisMonth} icon={IconUserCheck} />
        <StatCard label="ถึงกำหนดตรวจ" value={stats.dueRecall} icon={IconClock} />
        <StatCard label="ค้างชำระ" value={stats.withBalance} icon={IconWallet} />
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
                  filter === tab.id ? 'bg-emerald-600 text-white' : 'text-gray-500 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50">
                <th className="px-6 py-3 font-medium">คนไข้</th>
                <th className="px-6 py-3 font-medium">เบอร์โทร</th>
                <th className="px-6 py-3 font-medium">นัดล่าสุด</th>
                <th className="px-6 py-3 font-medium">นัดถัดไป</th>
                <th className="px-6 py-3 font-medium">สถานะตรวจ</th>
                <th className="px-6 py-3 font-medium">ค้างชำระ</th>
                <th className="px-6 py-3 font-medium">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPatients.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-xs font-semibold shrink-0">
                        {p.firstName.charAt(0)}
                      </div>
                      <span className="text-gray-800">{p.firstName} {p.lastName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{p.phone}</td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(p.lastVisitDate)}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {p.nextAppointmentDate ? `${formatDate(p.nextAppointmentDate)} · ${p.nextAppointmentLabel}` : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge label={recallConfig[p.recallStatus].label} tone={recallConfig[p.recallStatus].tone} />
                  </td>
                  <td className="px-6 py-4">
                    <span className={p.balance > 0 ? 'text-rose-600 font-medium' : 'text-gray-400'}>
                      {p.balance > 0 ? `฿${p.balance.toLocaleString()}` : '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => setDrawer({ open: true, mode: 'edit', patient: p })}
                      className={`text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 text-xs font-medium transition px-2 py-1.5 rounded-md ${focusRing}`}
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

        <div className="px-6 py-3 border-t border-gray-50">
          <p className="text-xs text-gray-400">แสดง {filteredPatients.length} จาก {patients.length} รายการ</p>
        </div>
      </div>

      <PatientDrawer
        open={drawer.open}
        mode={drawer.open ? drawer.mode : 'create'}
        patient={drawer.open && drawer.mode === 'edit' ? drawer.patient : undefined}
        onClose={() => setDrawer({ open: false })}
        onSubmit={handleSubmit}
      />
    </>
  )
}
