import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { id?: string; role?: string } | undefined

  if (!session || user?.role !== 'DENTIST' || !user?.id) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบด้วยบัญชีทันตแพทย์' }, { status: 401 })
  }

  const { id } = await params
  const appointment = await prisma.appointment.findUnique({ where: { id }, include: { service: true } })
  const dentist = await prisma.dentist.findUnique({ where: { userId: user.id } })

  if (!appointment || !dentist || appointment.dentistId !== dentist.id) {
    return NextResponse.json({ error: 'ไม่พบนัดหมายนี้' }, { status: 404 })
  }

  const { toothNumber, diagnosis, treatmentItems, nextVisit, nextVisitNote, addOns, servicePrice } = await req.json()

  const requestedServicePrice = typeof servicePrice === 'number' ? servicePrice : appointment.service.minPrice
  const clampedServicePrice = Math.min(Math.max(requestedServicePrice, appointment.service.minPrice), appointment.service.maxPrice)

  const items: string[] = Array.isArray(treatmentItems)
    ? treatmentItems.filter((t): t is string => typeof t === 'string' && t.trim() !== '')
    : []

  type RequestedAddOn = { serviceId?: string; customName?: string; quantity: number; unitPrice?: number }
  const requestedAddOns: RequestedAddOn[] = Array.isArray(addOns)
    ? addOns.filter((a): a is RequestedAddOn => !!a && (typeof a.serviceId === 'string' || typeof a.customName === 'string'))
    : []

  const catalogServiceIds = requestedAddOns.filter((a) => a.serviceId).map((a) => a.serviceId as string)
  const addOnServices = catalogServiceIds.length
    ? await prisma.service.findMany({ where: { id: { in: catalogServiceIds }, type: 'ADD_ON', isActive: true } })
    : []
  const addOnServiceById = new Map(addOnServices.map((s) => [s.id, s]))

  type AddOnRow = { serviceId: string | null; customName: string | null; quantity: number; unitPrice: number }

  const addOnRows = requestedAddOns
    .map((a): AddOnRow | null => {
      const quantity = Number.isFinite(a.quantity) && a.quantity >= 1 ? Math.floor(a.quantity) : 1

      if (a.serviceId) {
        const service = addOnServiceById.get(a.serviceId)
        if (!service) return null
        const requestedPrice = typeof a.unitPrice === 'number' ? a.unitPrice : service.minPrice
        const unitPrice = Math.min(Math.max(requestedPrice, service.minPrice), service.maxPrice)
        return { serviceId: service.id, customName: null, quantity, unitPrice }
      }

      const customName = a.customName?.trim()
      if (!customName) return null
      const unitPrice = typeof a.unitPrice === 'number' && a.unitPrice >= 0 ? a.unitPrice : 0
      return { serviceId: null, customName, quantity, unitPrice }
    })
    .filter((a): a is AddOnRow => a !== null)

  const treatment = await prisma.treatment.upsert({
    where: { appointmentId: id },
    update: {
      toothNumber: toothNumber || null,
      diagnosis: diagnosis || null,
      servicePrice: clampedServicePrice,
      nextVisit: nextVisit ? new Date(nextVisit) : null,
      nextVisitNote: nextVisitNote || null,
      items: { deleteMany: {}, create: items.map((text) => ({ text })) },
      addOns: { deleteMany: {}, create: addOnRows },
    },
    create: {
      appointmentId: id,
      toothNumber: toothNumber || null,
      diagnosis: diagnosis || null,
      servicePrice: clampedServicePrice,
      nextVisit: nextVisit ? new Date(nextVisit) : null,
      nextVisitNote: nextVisitNote || null,
      items: { create: items.map((text) => ({ text })) },
      addOns: { create: addOnRows },
    },
    include: { items: true, addOns: { include: { service: true } } },
  })

  return NextResponse.json({
    treatment: {
      toothNumber: treatment.toothNumber ?? '',
      diagnosis: treatment.diagnosis ?? '',
      servicePrice: treatment.servicePrice,
      treatmentItems: treatment.items.map((i) => i.text),
      nextVisit: treatment.nextVisit ? treatment.nextVisit.toISOString().slice(0, 10) : '',
      nextVisitNote: treatment.nextVisitNote ?? '',
      addOns: treatment.addOns.map((a) => ({
        serviceId: a.serviceId,
        serviceName: a.service?.name ?? a.customName ?? '',
        quantity: a.quantity,
        unitPrice: a.unitPrice,
      })),
    },
  })
}
