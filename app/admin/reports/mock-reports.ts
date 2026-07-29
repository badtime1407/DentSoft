import { services, dentists } from '@/app/admin/_mock/reference'

export type DailyStat = {
  date: string
  revenue: number
  completed: number
  cancelled: number
}

function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function offsetDate(base: Date, days: number): Date {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d
}

export function buildDailyStats(days: number, referenceDate: Date = new Date()): DailyStat[] {
  const result: DailyStat[] = []
  for (let i = days - 1; i >= 0; i--) {
    const date = offsetDate(referenceDate, -i)
    const dow = date.getDay()
    const weekendFactor = dow === 0 || dow === 6 ? 0.6 : 1
    const wave = Math.sin(i * 0.35)
    const wave2 = Math.sin(i * 0.13 + 1)

    const baseRevenue = 14000 + wave * 3500 + wave2 * 1500
    const revenue = Math.max(0, Math.round((baseRevenue * weekendFactor) / 100) * 100)

    const baseCompleted = 9 + wave * 3
    const completed = Math.max(0, Math.round(baseCompleted * weekendFactor))

    const baseCancelled = 1.4 + wave2 * 1
    const cancelled = Math.max(0, Math.round(baseCancelled * weekendFactor * 0.7))

    result.push({ date: toISODate(date), revenue, completed, cancelled })
  }
  return result
}

const SERVICE_WEIGHTS: Record<string, number> = {
  sv2: 0.18, // ขูดหินปูน
  sv3: 0.16, // อุดฟัน
  sv1: 0.14, // ตรวจสุขภาพฟัน
  sv8: 0.12, // ครอบฟัน
  sv7: 0.1, // รักษารากฟัน
  sv9: 0.1, // จัดฟัน (ปรับลวด)
  sv10: 0.08, // ผ่าฟันคุด
  sv5: 0.06, // ถอนฟัน
  sv6: 0.04, // ฟอกสีฟัน
  sv4: 0.02, // เคลือบฟลูออไรด์
}

const DENTIST_WEIGHTS: Record<string, number> = {
  dt1: 0.43,
  dt2: 0.36,
  dt3: 0.21,
}

export type RankedItem = { id: string; label: string; value: number }

export function buildRevenueByService(totalRevenue: number, topN = 6): RankedItem[] {
  const ranked = services
    .map((s) => ({ id: s.id, label: s.name, value: Math.round(totalRevenue * (SERVICE_WEIGHTS[s.id] ?? 0)) }))
    .sort((a, b) => b.value - a.value)

  const top = ranked.slice(0, topN)
  const rest = ranked.slice(topN)
  const restTotal = rest.reduce((sum, r) => sum + r.value, 0)
  if (restTotal > 0) top.push({ id: 'other', label: 'อื่นๆ', value: restTotal })
  return top
}

export function buildBookingsByDentist(totalVisits: number): RankedItem[] {
  return dentists
    .map((d) => ({ id: d.id, label: d.name, value: Math.round(totalVisits * (DENTIST_WEIGHTS[d.id] ?? 0)) }))
    .sort((a, b) => b.value - a.value)
}
