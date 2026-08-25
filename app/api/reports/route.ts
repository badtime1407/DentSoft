import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000

function toBangkok(date: Date) {
  return new Date(date.getTime() + BANGKOK_OFFSET_MS)
}

function bangkokMidnightUtc(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month, day) - BANGKOK_OFFSET_MS)
}

function toIsoDate(bangkokShiftedDate: Date) {
  return bangkokShiftedDate.toISOString().slice(0, 10)
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string } | undefined)?.role
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'ต้องเข้าสู่ระบบด้วยบัญชีแอดมิน' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const requestedDays = Number(searchParams.get('days'))
  const days = [7, 30, 90].includes(requestedDays) ? requestedDays : 30

  const nowBangkok = toBangkok(new Date())
  const y = nowBangkok.getUTCFullYear()
  const m = nowBangkok.getUTCMonth()
  const d = nowBangkok.getUTCDate()

  const start = bangkokMidnightUtc(y, m, d - (days - 1))
  const end = bangkokMidnightUtc(y, m, d + 1)

  const appointments = await prisma.appointment.findMany({
    where: { date: { gte: start, lt: end }, status: { in: ['COMPLETED', 'CANCELLED'] } },
    select: { date: true, status: true },
  })

  const buckets = new Map<string, { completed: number; cancelled: number }>()
  for (let i = 0; i < days; i++) {
    const key = toIsoDate(toBangkok(bangkokMidnightUtc(y, m, d - (days - 1) + i)))
    buckets.set(key, { completed: 0, cancelled: 0 })
  }

  for (const a of appointments) {
    const key = toIsoDate(toBangkok(a.date))
    const bucket = buckets.get(key)
    if (!bucket) continue
    if (a.status === 'COMPLETED') bucket.completed += 1
    else bucket.cancelled += 1
  }

  const dailyStats = Array.from(buckets.entries()).map(([date, v]) => ({ date, ...v }))

  return NextResponse.json({ dailyStats })
}
