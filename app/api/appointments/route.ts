import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { Appointment, Dentist, Patient, Service, Treatment, TreatmentItem } from '@prisma/client'

type FullAppointment = Appointment & { patient: Patient; service: Service; dentist: Dentist | null }

function serializeAdminAppointment(a: FullAppointment) {
  return {
    id: a.id,
    date: a.date.toISOString(),
    status: a.status,
    note: a.note,
    patientId: a.patientId,
    patientName: `${a.patient.firstName} ${a.patient.lastName}`,
    patientPhone: a.patient.phone,
    serviceId: a.serviceId,
    serviceName: a.service.name,
    durationMin: a.service.duration ?? 30,
    dentistId: a.dentistId,
    dentistName: a.dentist ? `${a.dentist.title} ${a.dentist.firstName} ${a.dentist.lastName}` : null,
    requestType: a.requestType,
    requestReason: a.requestReason,
    requestedAt: a.requestedAt ? a.requestedAt.toISOString() : null,
  }
}

const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000

function splitBangkok(date: Date) {
  const shifted = new Date(date.getTime() + BANGKOK_OFFSET_MS)
  const iso = shifted.toISOString()
  return { date: iso.slice(0, 10), time: iso.slice(11, 16) }
}

function ageFromBirthDate(birthDate: Date | null) {
  if (!birthDate) return 0
  const now = new Date()
  let age = now.getFullYear() - birthDate.getFullYear()
  const beforeBirthdayThisYear =
    now.getMonth() < birthDate.getMonth() ||
    (now.getMonth() === birthDate.getMonth() && now.getDate() < birthDate.getDate())
  if (beforeBirthdayThisYear) age -= 1
  return age
}

type DentistFullAppointment = Appointment & {
  patient: Patient
  service: Service
  treatment: (Treatment & { items: TreatmentItem[] }) | null
}

function serializeDentistAppointment(a: DentistFullAppointment) {
  const { date, time } = splitBangkok(a.date)
  return {
    id: a.id,
    date,
    time,
    patientId: a.patientId,
    patientName: `${a.patient.firstName} ${a.patient.lastName}`,
    patientAge: ageFromBirthDate(a.patient.birthDate),
    patientPhone: a.patient.phone ?? '-',
    serviceName: a.service.name,
    durationMin: a.service.duration ?? 30,
    status: a.status,
    note: a.note,
    treatment: a.treatment
      ? {
          toothNumber: a.treatment.toothNumber ?? '',
          diagnosis: a.treatment.diagnosis ?? '',
          treatmentItems: a.treatment.items.map((i) => i.text),
          nextVisit: a.treatment.nextVisit ? splitBangkok(a.treatment.nextVisit).date : '',
          images: [] as string[],
        }
      : undefined,
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  const user = session?.user as { id?: string; role?: string } | undefined
  const userId = user?.id
  const role = user?.role

  if (!session || !userId) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 })
  }

  if (role === 'ADMIN') {
    const appointments = await prisma.appointment.findMany({
      include: { patient: true, service: true, dentist: true },
      orderBy: { date: 'asc' },
    })
    return NextResponse.json({ appointments: appointments.map(serializeAdminAppointment) })
  }

  if (role === 'DENTIST') {
    const dentist = await prisma.dentist.findUnique({ where: { userId } })
    if (!dentist) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลทันตแพทย์ของบัญชีนี้' }, { status: 404 })
    }

    const appointments = await prisma.appointment.findMany({
      where: { dentistId: dentist.id },
      include: { patient: true, service: true, treatment: { include: { items: true } } },
      orderBy: { date: 'asc' },
    })

    return NextResponse.json({ appointments: appointments.map(serializeDentistAppointment) })
  }

  if (role !== 'PATIENT') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
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

  if (!session || !userId) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 })
  }

  const body = await req.json()

  if (role === 'ADMIN') {
    const { patientId, serviceId, dentistId, date, note } = body

    if (!patientId || !serviceId || !date) {
      return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 })
    }

    const appointmentDate = new Date(date)
    if (Number.isNaN(appointmentDate.getTime())) {
      return NextResponse.json({ error: 'วันเวลาที่เลือกไม่ถูกต้อง' }, { status: 400 })
    }

    const [patient, service] = await Promise.all([
      prisma.patient.findUnique({ where: { id: patientId } }),
      prisma.service.findUnique({ where: { id: serviceId } }),
    ])
    if (!patient) return NextResponse.json({ error: 'ไม่พบคนไข้ที่เลือก' }, { status: 404 })
    if (!service) return NextResponse.json({ error: 'ไม่พบบริการที่เลือก' }, { status: 404 })

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        serviceId,
        dentistId: dentistId || null,
        date: appointmentDate,
        status: 'CONFIRMED',
        note: note || null,
      },
      include: { patient: true, service: true, dentist: true },
    })

    return NextResponse.json({ appointment: serializeAdminAppointment(appointment) })
  }

  if (role !== 'PATIENT') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { serviceId, date } = body

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
