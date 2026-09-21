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

const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000

function bangkokDateOnly(date: Date): string {
  return new Date(date.getTime() + BANGKOK_OFFSET_MS).toISOString().slice(0, 10)
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
    treatment: a.treatment
      ? {
          toothNumber: a.treatment.toothNumber ?? '',
          diagnosis: a.treatment.diagnosis ?? '',
          treatmentItems: a.treatment.items.map((i) => i.text),
          images: a.treatment.images.map((img) => ({ id: img.id, url: `/api/treatment-images/${img.id}` })),
          servicePrice: a.treatment.servicePrice,
          addOns: a.treatment.addOns.map((ao) => ({
            id: ao.id,
            serviceId: ao.serviceId,
            serviceName: ao.service?.name ?? '',
            quantity: ao.quantity,
            unitPrice: ao.unitPrice,
          })),
          paymentStatus: a.treatment.paymentStatus,
          paidAt: a.treatment.paidAt ? a.treatment.paidAt.toISOString() : null,
          nextVisit: a.treatment.nextVisit ? bangkokDateOnly(a.treatment.nextVisit) : null,
          nextVisitNote: a.treatment.nextVisitNote,
        }
      : undefined,
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { id?: string; role?: string } | undefined
  const userId = user?.id
  const role = user?.role

  if (!session || !userId) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 })
  }

  const { id } = await params
  const existing = await prisma.appointment.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'ไม่พบนัดหมายนี้' }, { status: 404 })
  }

  const body = await req.json()

  if (role === 'ADMIN') {
    const { status, serviceId, dentistId, date, note } = body

    const nextDentistId = dentistId !== undefined ? dentistId || null : existing.dentistId
    const nextStatus = status || existing.status
    if (nextStatus === 'CONFIRMED' && !nextDentistId) {
      return NextResponse.json({ error: 'กรุณาเลือกทันตแพทย์ก่อนยืนยันนัดหมาย' }, { status: 400 })
    }

    if (date) {
      const duplicate = await prisma.appointment.findFirst({
        where: { id: { not: id }, patientId: existing.patientId, date: new Date(date), status: { not: 'CANCELLED' } },
      })
      if (duplicate) {
        return NextResponse.json({ error: 'คนไข้คนนี้มีนัดหมายในวันเวลานี้อยู่แล้ว' }, { status: 409 })
      }
    }

    let appointment
    try {
      appointment = await prisma.appointment.update({
        where: { id },
        data: {
          ...(status ? { status } : {}),
          ...(serviceId ? { serviceId } : {}),
          ...(dentistId !== undefined ? { dentistId: dentistId || null } : {}),
          ...(date ? { date: new Date(date) } : {}),
          ...(note !== undefined ? { note: note || null } : {}),
          requestType: null,
          requestReason: null,
          requestedAt: null,
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

  if (role === 'DENTIST') {
    const dentist = await prisma.dentist.findUnique({ where: { userId } })
    if (!dentist || existing.dentistId !== dentist.id) {
      return NextResponse.json({ error: 'ไม่พบนัดหมายนี้' }, { status: 404 })
    }

    const { status } = body
    if (status !== 'IN_TREATMENT' && status !== 'COMPLETED') {
      return NextResponse.json({ error: 'สถานะไม่ถูกต้อง' }, { status: 400 })
    }
    if (existing.status === 'CANCELLED' || existing.status === 'COMPLETED') {
      return NextResponse.json({ error: 'ไม่สามารถเปลี่ยนสถานะนัดหมายนี้ได้' }, { status: 400 })
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
    })

    await syncAppointmentsToSheet()

    return NextResponse.json({ appointment: { id: appointment.id, status: appointment.status } })
  }

  if (role === 'PATIENT') {
    const patient = await prisma.patient.findUnique({ where: { userId } })
    if (!patient || existing.patientId !== patient.id) {
      return NextResponse.json({ error: 'ไม่พบนัดหมายนี้' }, { status: 404 })
    }

    if (existing.status === 'CANCELLED' || existing.status === 'COMPLETED') {
      return NextResponse.json({ error: 'ไม่สามารถขอยกเลิก/เลื่อนนัดที่เสร็จสิ้นหรือถูกยกเลิกไปแล้วได้' }, { status: 400 })
    }

    const { requestType, requestReason } = body
    if (requestType !== 'CANCEL' && requestType !== 'RESCHEDULE') {
      return NextResponse.json({ error: 'ประเภทคำขอไม่ถูกต้อง' }, { status: 400 })
    }
    if (!requestReason || typeof requestReason !== 'string') {
      return NextResponse.json({ error: 'กรุณาระบุเหตุผล' }, { status: 400 })
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { requestType, requestReason, requestedAt: new Date() },
      include: { service: true, dentist: true },
    })

    await syncAppointmentsToSheet()

    return NextResponse.json({ appointment })
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
