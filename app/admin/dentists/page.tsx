'use client'

import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '@/components/admin/PageHeader'
import { StatCard } from '@/components/admin/StatCard'
import { DentistDrawer, type DentistFormValues } from '@/components/admin/DentistDrawer'
import { IconBadge, IconCalendar, IconUserCheck, IconPhone, IconPlus } from '@/components/admin/icons'
import { services } from '@/app/admin/_mock/reference'
import type { AdminDentist } from './types'
import { focusRing } from '@/lib/admin/focus-ring'

const dayOrder = [1, 2, 3, 4, 5, 6, 0]
const dayShortLabels = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา']

type DrawerState =
  | { open: false }
  | { open: true; mode: 'create' }
  | { open: true; mode: 'edit'; dentist: AdminDentist }

export default function AdminDentists() {
  const [dentists, setDentists] = useState<AdminDentist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [drawer, setDrawer] = useState<DrawerState>({ open: false })
  const [formError, setFormError] = useState('')

  const todayIndex = useMemo(() => new Date().getDay(), [])

  useEffect(() => {
    fetch('/api/dentists')
      .then((res) => res.json())
      .then((data: { dentists?: AdminDentist[] }) => setDentists(data.dentists ?? []))
      .finally(() => setIsLoading(false))
  }, [])

  const stats = useMemo(() => {
    const totalBookedToday = dentists.reduce((sum, d) => sum + d.bookedToday, 0)
    const workingToday = dentists.filter((d) => d.schedule[todayIndex]?.active).length
    return { total: dentists.length, totalBookedToday, workingToday }
  }, [dentists, todayIndex])

  async function handleSubmit(values: DentistFormValues) {
    setFormError('')
    try {
      if (drawer.open && drawer.mode === 'edit') {
        const id = drawer.dentist.id
        const res = await fetch(`/api/dentists/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })
        const data = await res.json()
        if (!res.ok) {
          setFormError(data.error ?? 'บันทึกไม่สำเร็จ')
          return
        }
        setDentists((prev) => prev.map((d) => (d.id === id ? { ...d, ...data.dentist } : d)))
      } else {
        const res = await fetch('/api/dentists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })
        const data = await res.json()
        if (!res.ok) {
          setFormError(data.error ?? 'บันทึกไม่สำเร็จ')
          return
        }
        setDentists((prev) => [...prev, data.dentist])
      }
      setDrawer({ open: false })
    } catch {
      setFormError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    }
  }

  return (
    <>
      <PageHeader
        title="ทันตแพทย์"
        subtitle={`${dentists.length} ทันตแพทย์ทั้งหมด`}
        actions={
          <button
            type="button"
            onClick={() => setDrawer({ open: true, mode: 'create' })}
            className={`flex items-center gap-2 px-3.5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 ${focusRing}`}
          >
            <IconPlus className="w-4 h-4" />
            เพิ่มทันตแพทย์
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="ทันตแพทย์ทั้งหมด" value={stats.total} icon={IconBadge} />
        <StatCard label="คิววันนี้รวม" value={stats.totalBookedToday} icon={IconCalendar} />
        <StatCard label="ทำงานวันนี้" value={stats.workingToday} icon={IconUserCheck} />
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-400 text-center py-10">กำลังโหลดข้อมูลทันตแพทย์...</p>
      ) : dentists.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">ยังไม่มีทันตแพทย์ในระบบ กด &quot;เพิ่มทันตแพทย์&quot; เพื่อเริ่มต้น</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {dentists.map((d) => {
            const dentistServices = services.filter((s) => s.specialties.includes(d.specialty))
            return (
              <div key={d.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-semibold shrink-0">
                      {d.firstName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{d.title} {d.firstName} {d.lastName}</p>
                      <p className="text-xs text-gray-400 truncate">{d.specialty}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{d.bookedToday} คิววันนี้</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <IconPhone className="w-3.5 h-3.5 text-gray-300" />
                  {d.phone}
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1.5">เวลาทำงาน</p>
                  <div className="grid grid-cols-7 gap-1">
                    {dayOrder.map((dayIdx) => {
                      const day = d.schedule[dayIdx]
                      return (
                        <div
                          key={dayIdx}
                          title={day.active ? `${day.startTime} - ${day.endTime}` : 'วันหยุด'}
                          className={`flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-[11px] font-medium ${
                            day.active ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-300'
                          }`}
                        >
                          <span>{dayShortLabels[dayOrder.indexOf(dayIdx)]}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1.5">บริการที่ให้</p>
                  <div className="flex flex-wrap gap-1.5">
                    {dentistServices.map((s) => (
                      <span key={s.id} className="px-2 py-1 rounded-full text-xs text-slate-600 bg-slate-50">{s.name}</span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDrawer({ open: true, mode: 'edit', dentist: d })}
                  className={`mt-auto text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs font-medium transition px-2.5 py-2 rounded-md self-start ${focusRing}`}
                >
                  แก้ไขข้อมูล / เวลาทำงาน
                </button>
              </div>
            )
          })}
        </div>
      )}

      <DentistDrawer
        open={drawer.open}
        mode={drawer.open ? drawer.mode : 'create'}
        dentist={drawer.open && drawer.mode === 'edit' ? drawer.dentist : undefined}
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
