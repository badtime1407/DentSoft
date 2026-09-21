import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { syncAppointmentsToSheet } from '@/lib/googleSheets'
import { Prisma } from '@prisma/client'

function isDuplicateBookingError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string } | undefined)?.role

  if (!session || role !== 'ADMIN') {
    return NextResponse.json({ error: 'ต้องเข้าสู่ระบบด้วยบัญชีแอดมิน' }, { status: 401 })
  }

  const { id } = await params
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { service: true, treatment: { include: { addOns: true } } },
  })
  if (!appointment || !appointment.treatment) {
    return NextResponse.json({ error: 'ไม่พบบันทึกการรักษาของนัดหมายนี้' }, { status: 404 })
  }

  if (appointment.status === 'CANCELLED') {
    return NextResponse.json({ error: 'ไม่สามารถรับชำระเงินของนัดหมายที่ถูกยกเลิกแล้วได้' }, { status: 400 })
  }

  const body = await req.json().catch(() => ({}))
  type PriceUpdate = { id?: string; unitPrice?: number }
  const priceUpdates: PriceUpdate[] = Array.isArray(body?.addOns) ? body.addOns : []
  const existingAddOnIds = new Set(appointment.treatment.addOns.map((a) => a.id))
  const validUpdates = priceUpdates.filter(
    (u): u is { id: string; unitPrice: number } =>
      typeof u.id === 'string' && existingAddOnIds.has(u.id) && typeof u.unitPrice === 'number' && u.unitPrice >= 0
  )

  const requestedServicePrice = typeof body?.servicePrice === 'number' ? body.servicePrice : appointment.treatment.servicePrice
  const clampedServicePrice =
    requestedServicePrice == null
      ? null
      : Math.min(Math.max(requestedServicePrice, appointment.service.minPrice), appointment.service.maxPrice)

  const treatment = await prisma.$transaction(async (tx) => {
    for (const update of validUpdates) {
      await tx.treatmentAddOn.update({ where: { id: update.id }, data: { unitPrice: update.unitPrice } })
    }
    return tx.treatment.update({
      where: { appointmentId: id },
      data: { servicePrice: clampedServicePrice, paymentStatus: 'PAID', paidAt: new Date() },
      include: { addOns: { include: { service: true } } },
    })
  })

  // การนัดครั้งถัดไปเป็น best-effort แยกจากการยืนยันรับชำระเงิน — ชำระเงินต้องสำเร็จเสมอ
  // ต่อให้จองนัดครั้งถัดไปไม่ผ่าน (เช่นชนกับนัดอื่นของคนไข้คนเดียวกัน)
  let nextAppointmentError: string | null = null
  const nextAppointmentInput = body?.nextAppointment as { date?: unknown; time?: unknown } | undefined
  if (
    nextAppointmentInput &&
    typeof nextAppointmentInput.date === 'string' &&
    nextAppointmentInput.date &&
    typeof nextAppointmentInput.time === 'string' &&
    nextAppointmentInput.time
  ) {
    const nextDate = new Date(`${nextAppointmentInput.date}T${nextAppointmentInput.time}:00+07:00`)
    if (Number.isNaN(nextDate.getTime())) {
      nextAppointmentError = 'วันเวลานัดครั้งถัดไปไม่ถูกต้อง'
    } else {
      try {
        await prisma.appointment.create({
          data: {
            patientId: appointment.patientId,
            serviceId: appointment.serviceId,
            dentistId: appointment.dentistId,
            date: nextDate,
            status: 'CONFIRMED',
          },
        })
        await syncAppointmentsToSheet()
      } catch (error) {
        nextAppointmentError = isDuplicateBookingError(error)
          ? 'คนไข้คนนี้มีนัดหมายในวันเวลานี้อยู่แล้ว กรุณาเลือกวันเวลาอื่นสำหรับนัดครั้งถัดไป'
          : 'จองนัดครั้งถัดไปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
      }
    }
  }

  return NextResponse.json({
    servicePrice: treatment.servicePrice,
    addOns: treatment.addOns.map((ao) => ({
      id: ao.id,
      serviceId: ao.serviceId,
      serviceName: ao.service?.name ?? ao.customName ?? '',
      quantity: ao.quantity,
      unitPrice: ao.unitPrice,
    })),
    paymentStatus: treatment.paymentStatus,
    paidAt: treatment.paidAt ? treatment.paidAt.toISOString() : null,
    nextAppointmentError,
  })
}
