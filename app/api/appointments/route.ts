import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { syncAppointmentsToSheet } from '@/lib/googleSheets'
import { Prisma } from '@prisma/client'
import type { Appointment, Dentist, Patient, Service, Treatment, TreatmentItem, TreatmentImage, TreatmentAddOn } from '@prisma/client'

function isDuplicateBookingError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
}

const MIN_ADVANCE_DAYS = 3

// ทุกครึ่งชั่วโมงตลอดเวลาทำการของคลินิก (09:30-17:00)
const TIME_SLOTS = Array.from({ length: 16 }, (_, i) => {
  const totalMin = 9 * 60 + 30 + i * 30
  const h = String(Math.floor(totalMin / 60)).padStart(2, '0')
  const m = String(totalMin % 60).padStart(2, '0')
  return `${h}:${m}`
})

function todayInBangkok() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Bangkok' })
}

function addDaysToISODate(dateISO: string, days: number): string {
  const [y, m, d] = dateISO.split('-').map(Number)
  const next = new Date(Date.UTC(y, m - 1, d + days))
  return next.toISOString().slice(0, 10)
}

function dayOfWeekFromISODate(dateISO: string): number {
  const [y, m, d] = dateISO.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}

type FullAppointment = Appointment & {
  patient: Patient
  service: Service
  dentist: Dentist | null
  treatment:
    | (Treatment & {
        items: TreatmentItem[]
        images: Pick<TreatmentImage, 'id'>[]
        addOns: (TreatmentAddOn & { service: Service | null })[]
      })
    | null
}

function serializeAdminAppointment(a: FullAppointment) {
  return {
    id: a.id,
    date: a.date.toISOString(),
    status: a.status,
    updatedAt: a.updatedAt.toISOString(),
    note: a.note,
    patientId: a.patientId,
    patientName: `${a.patient.firstName} ${a.patient.lastName}`,
    patientPhone: a.patient.phone,
    serviceId: a.serviceId,
    serviceName: a.service.name,
    serviceMinPrice: a.service.minPrice,
    serviceMaxPrice: a.service.maxPrice,
    durationMin: a.service.duration ?? 30,
    dentistId: a.dentistId,
    dentistName: a.dentist ? `${a.dentist.title} ${a.dentist.firstName} ${a.dentist.lastName}` : null,
    requestType: a.requestType,
    requestReason: a.requestReason,
    requestedAt: a.requestedAt ? a.requestedAt.toISOString() : null,
    treatment: serializeTreatment(a.treatment),
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
  treatment:
    | (Treatment & {
        items: TreatmentItem[]
        images: Pick<TreatmentImage, 'id'>[]
        addOns: (TreatmentAddOn & { service: Service | null })[]
      })
    | null
}

type TreatmentWithDetails = Treatment & {
  items: TreatmentItem[]
  images: Pick<TreatmentImage, 'id'>[]
  addOns: (TreatmentAddOn & { service: Service | null })[]
}

function serializeTreatment(treatment: TreatmentWithDetails | null) {
  if (!treatment) return undefined
  return {
    toothNumber: treatment.toothNumber ?? '',
    diagnosis: treatment.diagnosis ?? '',
    servicePrice: treatment.servicePrice,
    treatmentItems: treatment.items.map((i) => i.text),
    nextVisit: treatment.nextVisit ? splitBangkok(treatment.nextVisit).date : '',
    nextVisitNote: treatment.nextVisitNote ?? '',
    images: treatment.images.map((img) => ({ id: img.id, url: `/api/treatment-images/${img.id}` })),
    addOns: treatment.addOns.map((ao) => ({
      id: ao.id,
      serviceId: ao.serviceId,
      serviceName: ao.service?.name ?? ao.customName ?? '',
      quantity: ao.quantity,
      unitPrice: ao.unitPrice,
    })),
    paymentStatus: treatment.paymentStatus,
    paidAt: treatment.paidAt ? splitBangkok(treatment.paidAt).date : null,
  }
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
    patientAllergyNote: a.patient.allergyNote,
    serviceName: a.service.name,
    durationMin: a.service.duration ?? 30,
    serviceMinPrice: a.service.minPrice,
    serviceMaxPrice: a.service.maxPrice,
    status: a.status,
    note: a.note,
    treatment: serializeTreatment(a.treatment),
  }
}

type PatientFullAppointment = Appointment & {
  service: Service
  dentist: Dentist | null
  treatment: TreatmentWithDetails | null
}

function serializePatientAppointment(a: PatientFullAppointment) {
  return {
    id: a.id,
    date: a.date.toISOString(),
    status: a.status,
    requestType: a.requestType,
    requestReason: a.requestReason,
    requestedAt: a.requestedAt ? a.requestedAt.toISOString() : null,
    service: { name: a.service.name },
    dentist: a.dentist ? { title: a.dentist.title, firstName: a.dentist.firstName, lastName: a.dentist.lastName } : null,
    treatment: serializeTreatment(a.treatment),
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
      include: {
        patient: true,
        service: true,
        dentist: true,
        treatment: {
          include: {
            items: true,
            images: { select: { id: true } },
            addOns: { include: { service: true } },
          },
        },
      },
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
      include: {
        patient: true,
        service: true,
        treatment: {
          include: {
            items: true,
            images: { select: { id: true } },
            addOns: { include: { service: true } },
          },
        },
      },
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
    include: {
      service: true,
      dentist: true,
      treatment: {
        include: {
          items: true,
          images: { select: { id: true } },
          addOns: { include: { service: true } },
        },
      },
    },
    orderBy: { date: 'asc' },
  })

  return NextResponse.json({
    patient: { firstName: patient.firstName, lastName: patient.lastName },
    appointments: appointments.map(serializePatientAppointment),
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

    const duplicate = await prisma.appointment.findFirst({
      where: { patientId, date: appointmentDate, status: { not: 'CANCELLED' } },
    })
    if (duplicate) {
      return NextResponse.json({ error: 'คนไข้คนนี้มีนัดหมายในวันเวลานี้อยู่แล้ว' }, { status: 409 })
    }

    let appointment
    try {
      appointment = await prisma.appointment.create({
        data: {
          patientId,
          serviceId,
          dentistId: dentistId || null,
          date: appointmentDate,
          status: 'CONFIRMED',
          note: note || null,
        },
        include: {
          patient: true,
          service: true,
          dentist: true,
          treatment: {
            include: {
              items: true,
              images: { select: { id: true } },
              addOns: { include: { service: true } },
            },
          },
        },
      })
    } catch (error) {
      if (isDuplicateBookingError(error)) {
        return NextResponse.json({ error: 'คนไข้คนนี้มีนัดหมายในวันเวลานี้อยู่แล้ว' }, { status: 409 })
      }
      throw error
    }

    await syncAppointmentsToSheet()

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

  const { date: apptDate, time: apptTime } = splitBangkok(appointmentDate)
  if (!TIME_SLOTS.includes(apptTime)) {
    return NextResponse.json(
      { error: `เวลาที่จองได้มีเฉพาะ ${TIME_SLOTS.join(', ')} น. เท่านั้น` },
      { status: 400 }
    )
  }

  const earliestBookableDate = addDaysToISODate(todayInBangkok(), MIN_ADVANCE_DAYS)
  if (apptDate < earliestBookableDate) {
    return NextResponse.json(
      { error: `คลินิกต้องการให้จองล่วงหน้าอย่างน้อย ${MIN_ADVANCE_DAYS} วัน วันที่เร็วที่สุดที่จองได้คือ ${earliestBookableDate}` },
      { status: 400 }
    )
  }

  const dayOfWeek = dayOfWeekFromISODate(apptDate)
  const capacity = await prisma.schedule.count({
    where: { isActive: true, dayOfWeek, startTime: { lte: apptTime }, endTime: { gt: apptTime } },
  })
  const bookedCount = await prisma.appointment.count({
    where: { date: appointmentDate, status: { not: 'CANCELLED' } },
  })
  if (capacity === 0 || bookedCount >= capacity) {
    return NextResponse.json({ error: 'ช่วงเวลานี้เต็มแล้วหรือคลินิกไม่เปิดให้บริการช่วงเวลานี้' }, { status: 409 })
  }

  const patient = await prisma.patient.findUnique({ where: { userId } })
  if (!patient) {
    return NextResponse.json({ error: 'ไม่พบข้อมูลคนไข้ของบัญชีนี้' }, { status: 404 })
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } })
  if (!service || !service.isActive) {
    return NextResponse.json({ error: 'ไม่พบบริการที่เลือก' }, { status: 404 })
  }

  const duplicate = await prisma.appointment.findFirst({
    where: { patientId: patient.id, date: appointmentDate, status: { not: 'CANCELLED' } },
  })
  if (duplicate) {
    return NextResponse.json({ error: 'คุณมีนัดหมายในวันเวลานี้อยู่แล้ว' }, { status: 409 })
  }

  let appointment
  try {
    appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        serviceId: service.id,
        date: appointmentDate,
        status: 'PENDING',
      },
      include: { service: true },
    })
  } catch (error) {
    if (isDuplicateBookingError(error)) {
      return NextResponse.json({ error: 'คุณมีนัดหมายในวันเวลานี้อยู่แล้ว' }, { status: 409 })
    }
    throw error
  }

  await syncAppointmentsToSheet()

  return NextResponse.json({ appointment })
}
