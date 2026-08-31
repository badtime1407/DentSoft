import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { Appointment, Dentist, Patient, Service } from '@prisma/client'

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

    const appointment = await prisma.appointment.update({
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
      include: { patient: true, service: true, dentist: true },
    })

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

    return NextResponse.json({ appointment })
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
