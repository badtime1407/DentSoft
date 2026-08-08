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
