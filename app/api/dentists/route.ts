import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type DaySchedule = { active: boolean; startTime: string; endTime: string }

function toWeeklySchedule(schedules: { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }[]): DaySchedule[] {
  return Array.from({ length: 7 }, (_, dayOfWeek) => {
    const day = schedules.find((s) => s.dayOfWeek === dayOfWeek)
    return {
      active: day?.isActive ?? false,
      startTime: day?.startTime ?? '09:00',
      endTime: day?.endTime ?? '18:00',
    }
  })
}

export async function GET() {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string } | undefined)?.role
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'ต้องเข้าสู่ระบบด้วยบัญชีแอดมิน' }, { status: 401 })
  }

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const endOfToday = new Date(startOfToday)
  endOfToday.setDate(endOfToday.getDate() + 1)

  const dentists = await prisma.dentist.findMany({
    include: {
      schedules: true,
      appointments: { where: { date: { gte: startOfToday, lt: endOfToday } } },
    },
    orderBy: { createdAt: 'asc' },
  })

  const result = dentists.map((d) => ({
    id: d.id,
    title: d.title,
    firstName: d.firstName,
    lastName: d.lastName,
    specialty: d.specialty,
    phone: d.phone,
    schedule: toWeeklySchedule(d.schedules),
    bookedToday: d.appointments.length,
  }))

  return NextResponse.json({ dentists: result })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string } | undefined)?.role
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'ต้องเข้าสู่ระบบด้วยบัญชีแอดมิน' }, { status: 401 })
  }

  const { userId, title, firstName, lastName, specialty, phone, schedule } = await req.json()

  if (!userId || !firstName || !lastName || !Array.isArray(schedule) || schedule.length !== 7) {
    return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 })
  }

  const targetUser = await prisma.user.findUnique({ where: { id: userId }, include: { dentist: true } })
  if (!targetUser || targetUser.role !== 'PATIENT' || targetUser.dentist) {
    return NextResponse.json({ error: 'บัญชีนี้ไม่สามารถตั้งเป็นทันตแพทย์ได้' }, { status: 400 })
  }

  await prisma.user.update({ where: { id: userId }, data: { role: 'DENTIST' } })

  const dentist = await prisma.dentist.create({
    data: {
      userId,
      title: title || 'ทพ.',
      firstName,
      lastName,
      specialty: specialty || null,
      phone: phone || null,
      schedules: {
        create: (schedule as DaySchedule[]).map((d, dayOfWeek) => ({
          dayOfWeek,
          startTime: d.startTime,
          endTime: d.endTime,
          isActive: d.active,
        })),
      },
    },
    include: { schedules: true },
  })
  return NextResponse.json({
    dentist: {
      id: dentist.id,
      title: dentist.title,
      firstName: dentist.firstName,
      lastName: dentist.lastName,
      specialty: dentist.specialty,
      phone: dentist.phone,
      schedule: toWeeklySchedule(dentist.schedules),
      bookedToday: 0,
    },
  })
}
