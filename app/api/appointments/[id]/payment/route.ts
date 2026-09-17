import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string } | undefined)?.role

  if (!session || role !== 'ADMIN') {
    return NextResponse.json({ error: 'ต้องเข้าสู่ระบบด้วยบัญชีแอดมิน' }, { status: 401 })
  }

  const { id } = await params
  const existing = await prisma.treatment.findUnique({ where: { appointmentId: id }, include: { addOns: true } })
  if (!existing) {
    return NextResponse.json({ error: 'ไม่พบบันทึกการรักษาของนัดหมายนี้' }, { status: 404 })
  }

  const body = await req.json().catch(() => ({}))
  type PriceUpdate = { id?: string; unitPrice?: number }
  const priceUpdates: PriceUpdate[] = Array.isArray(body?.addOns) ? body.addOns : []
  const existingAddOnIds = new Set(existing.addOns.map((a) => a.id))
  const validUpdates = priceUpdates.filter(
    (u): u is { id: string; unitPrice: number } =>
      typeof u.id === 'string' && existingAddOnIds.has(u.id) && typeof u.unitPrice === 'number' && u.unitPrice >= 0
  )

  const treatment = await prisma.$transaction(async (tx) => {
    for (const update of validUpdates) {
      await tx.treatmentAddOn.update({ where: { id: update.id }, data: { unitPrice: update.unitPrice } })
    }
    return tx.treatment.update({
      where: { appointmentId: id },
      data: { paymentStatus: 'PAID', paidAt: new Date() },
      include: { addOns: { include: { service: true } } },
    })
  })

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
  })
}
