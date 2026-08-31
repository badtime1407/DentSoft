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

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string } | undefined)?.role
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'ต้องเข้าสู่ระบบด้วยบัญชีแอดมิน' }, { status: 401 })
  }

  const { id } = await params
  const { title, firstName, lastName, specialty, phone, schedule, serviceIds } = await req.json()

  if (!firstName || !lastName || !Array.isArray(schedule) || schedule.length !== 7) {
    return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 })
  }

  const existing = await prisma.dentist.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'ไม่พบทันตแพทย์นี้' }, { status: 404 })
  }

  const validServiceIds: string[] = Array.isArray(serviceIds)
    ? serviceIds.filter((sid): sid is string => typeof sid === 'string')
    : []

  await prisma.schedule.deleteMany({ where: { dentistId: id } })
  await prisma.dentistService.deleteMany({ where: { dentistId: id } })

  const dentist = await prisma.dentist.update({
    where: { id },
    data: {
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
    include: { schedules: true, services: { include: { service: true } } },
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
