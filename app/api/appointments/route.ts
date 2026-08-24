import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  const user = session?.user as { id?: string; role?: string } | undefined
  const userId = user?.id
  const role = user?.role

  if (!session || role !== 'PATIENT' || !userId) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบด้วยบัญชีคนไข้' }, { status: 401 })
  }

  const patient = await prisma.patient.findUnique({ where: { userId } })
  if (!patient) {
    return NextResponse.json({ error: 'ไม่พบข้อมูลคนไข้ของบัญชีนี้' }, { status: 404 })
  }

  const appointments = await prisma.appointment.findMany({
    where: { patientId: patient.id },
    include: { service: true, dentist: true },
    orderBy: { date: 'asc' },
  })

  return NextResponse.json({
    patient: { firstName: patient.firstName, lastName: patient.lastName },
    appointments,
  })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { id?: string; role?: string } | undefined
  const userId = user?.id
  const role = user?.role

  if (!session || role !== 'PATIENT' || !userId) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบด้วยบัญชีคนไข้' }, { status: 401 })
  }

  const { serviceId, date } = await req.json()

  if (!serviceId || typeof serviceId !== 'string' || !date || typeof date !== 'string') {
    return NextResponse.json({ error: 'ข้อมูลการจองไม่ครบถ้วน' }, { status: 400 })
  }

  const appointmentDate = new Date(date)
  if (Number.isNaN(appointmentDate.getTime())) {
    return NextResponse.json({ error: 'วันเวลาที่เลือกไม่ถูกต้อง' }, { status: 400 })
  }

  const patient = await prisma.patient.findUnique({ where: { userId } })
  if (!patient) {
    return NextResponse.json({ error: 'ไม่พบข้อมูลคนไข้ของบัญชีนี้' }, { status: 404 })
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } })
  if (!service || !service.isActive) {
    return NextResponse.json({ error: 'ไม่พบบริการที่เลือก' }, { status: 404 })
  }

  const appointment = await prisma.appointment.create({
    data: {
      patientId: patient.id,
      serviceId: service.id,
      date: appointmentDate,
      status: 'PENDING',
    },
    include: { service: true },
  })

  return NextResponse.json({ appointment })
}
