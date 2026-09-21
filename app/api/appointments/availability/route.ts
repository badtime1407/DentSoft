import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// ทุกครึ่งชั่วโมงตลอดเวลาทำการของคลินิก (09:30-17:00)
const TIME_SLOTS = Array.from({ length: 16 }, (_, i) => {
  const totalMin = 9 * 60 + 30 + i * 30
  const h = String(Math.floor(totalMin / 60)).padStart(2, '0')
  const m = String(totalMin % 60).padStart(2, '0')
  return `${h}:${m}`
})

function dayOfWeekFromISODate(dateISO: string): number {
  const [y, m, d] = dateISO.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 })
  }

  const date = new URL(req.url).searchParams.get('date')
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'วันที่ไม่ถูกต้อง' }, { status: 400 })
  }

  const dayOfWeek = dayOfWeekFromISODate(date)

  const fullTimes = (
    await Promise.all(
      TIME_SLOTS.map(async (time) => {
        const capacity = await prisma.schedule.count({
          where: { isActive: true, dayOfWeek, startTime: { lte: time }, endTime: { gt: time } },
        })
        if (capacity === 0) return time

        const booked = await prisma.appointment.count({
          where: { date: new Date(`${date}T${time}:00+07:00`), status: { not: 'CANCELLED' } },
        })
        return booked >= capacity ? time : null
      })
    )
  ).filter((time): time is string => time !== null)

  return NextResponse.json({ fullTimes })
}
