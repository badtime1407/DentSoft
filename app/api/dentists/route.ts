import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

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
      services: { include: { service: true } },
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
    services: d.services.map((ds) => ({
      id: ds.service.id,
      name: ds.service.name,
      minPrice: ds.service.minPrice,
      maxPrice: ds.service.maxPrice,
      duration: ds.service.duration,
    })),
  }))

  return NextResponse.json({ dentists: result })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string } | undefined)?.role
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'ต้องเข้าสู่ระบบด้วยบัญชีแอดมิน' }, { status: 401 })
  }

  const { title, firstName, lastName, specialty, phone, email, username, password, schedule, serviceIds } = await req.json()

  if (!firstName || !lastName || !email || !username || !password || !Array.isArray(schedule) || schedule.length !== 7) {
    return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 })
  }

  const validServiceIds: string[] = Array.isArray(serviceIds)
    ? serviceIds.filter((id): id is string => typeof id === 'string')
    : []

  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } })
  if (existing) {
    return NextResponse.json({ error: 'Email หรือ Username นี้ถูกใช้งานแล้ว' }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role: 'DENTIST',
      dentist: {
        create: {
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
          services: {
            create: validServiceIds.map((serviceId) => ({ serviceId })),
          },
        },
      },
    },
    include: { dentist: { include: { schedules: true, services: { include: { service: true } } } } },
  })

  const dentist = user.dentist!
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
      services: dentist.services.map((ds) => ({
        id: ds.service.id,
        name: ds.service.name,
        minPrice: ds.service.minPrice,
        maxPrice: ds.service.maxPrice,
        duration: ds.service.duration,
      })),
    },
  })
}
