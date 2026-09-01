'use client'

import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { VisitsStatusChart } from '@/components/admin/VisitsStatusChart'
import { IconCalendar, IconCheckCircle, IconXCircle } from '@/components/admin/icons'
import { focusRing } from '@/lib/shared/focus-ring'

type DailyStat = { date: string; completed: number; cancelled: number }

const rangeOptions = [
  { id: 7, label: '7 วัน' },
  { id: 30, label: '30 วัน' },
  { id: 90, label: '90 วัน' },
]

function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminReports() {
  const [rangeDays, setRangeDays] = useState(30)
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/reports?days=${rangeDays}`)
      .then((res) => res.json())
      .then((data: { dailyStats?: DailyStat[] }) => setDailyStats(data.dailyStats ?? []))
      .finally(() => setIsLoading(false))
  }, [rangeDays])

  const totals = useMemo(() => {
    const completed = dailyStats.reduce((sum, d) => sum + d.completed, 0)
    const cancelled = dailyStats.reduce((sum, d) => sum + d.cancelled, 0)
    const visits = completed + cancelled
    return {
      visits,
      completedRate: visits > 0 ? Math.round((completed / visits) * 100) : 0,
      cancelRate: visits > 0 ? Math.round((cancelled / visits) * 100) : 0,
      completed,
    }
  }, [dailyStats])

  return (
    <>
      <PageHeader
        title="รายงาน"
        subtitle={`ข้อมูล ${rangeDays} วันที่ผ่านมา`}
        actions={
          <div className="flex gap-1.5">
            {rangeOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRangeDays(opt.id)}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${focusRing} ${
                  rangeDays === opt.id ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        }
      />

      <p className="text-xs text-gray-400 mb-4 -mt-2">
        ยังไม่รวมรายงานรายได้ เพราะระบบยังไม่มีการบันทึกยอดเงินจริงที่เก็บจากคนไข้ (รอราคา/แพ็คเกจสรุปก่อน)
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="จำนวนคิวทั้งหมด" value={totals.visits} icon={IconCalendar} />
        <StatCard label="อัตราเสร็จสิ้น" value={`${totals.completedRate}%`} icon={IconCheckCircle} />
        <StatCard label="อัตรายกเลิก" value={`${totals.cancelRate}%`} icon={IconXCircle} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-900">คิวเสร็จสิ้น / ยกเลิก</h2>
        <p className="text-xs text-gray-400 mt-0.5 mb-4">Visits by status</p>
        {isLoading ? (
          <p className="text-sm text-gray-400 text-center py-10">กำลังโหลดข้อมูล...</p>
        ) : (
          <VisitsStatusChart data={dailyStats} />
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">ข้อมูลรายวัน</h2>
          <p className="text-xs text-gray-400 mt-0.5">ตารางข้อมูลสำหรับกราฟด้านบน</p>
        </div>
        <div className="max-h-80 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50 sticky top-0 bg-white">
                <th className="px-6 py-3 font-medium">วันที่</th>
                <th className="px-6 py-3 font-medium">เสร็จสิ้น</th>
                <th className="px-6 py-3 font-medium">ยกเลิก</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[...dailyStats].reverse().map((d) => (
                <tr key={d.date} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3 text-gray-700">{formatDate(d.date)}</td>
                  <td className="px-6 py-3 text-gray-700 tabular-nums">{d.completed}</td>
                  <td className="px-6 py-3 text-gray-700 tabular-nums">{d.cancelled}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
