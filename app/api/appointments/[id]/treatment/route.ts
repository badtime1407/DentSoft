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
  const appointment = await prisma.appointment.findUnique({ where: { id } })
  const dentist = await prisma.dentist.findUnique({ where: { userId: user.id } })

  if (!appointment || !dentist || appointment.dentistId !== dentist.id) {
    return NextResponse.json({ error: 'ไม่พบนัดหมายนี้' }, { status: 404 })
  }

  const { toothNumber, diagnosis, treatmentItems, nextVisit } = await req.json()

  const items: string[] = Array.isArray(treatmentItems)
    ? treatmentItems.filter((t): t is string => typeof t === 'string' && t.trim() !== '')
    : []

  const treatment = await prisma.treatment.upsert({
    where: { appointmentId: id },
    update: {
      toothNumber: toothNumber || null,
      diagnosis: diagnosis || null,
      nextVisit: nextVisit ? new Date(nextVisit) : null,
      items: { deleteMany: {}, create: items.map((text) => ({ text })) },
    },
    create: {
      appointmentId: id,
      toothNumber: toothNumber || null,
      diagnosis: diagnosis || null,
      nextVisit: nextVisit ? new Date(nextVisit) : null,
      items: { create: items.map((text) => ({ text })) },
    },
    include: { items: true },
  })

  return NextResponse.json({
    treatment: {
      toothNumber: treatment.toothNumber ?? '',
      diagnosis: treatment.diagnosis ?? '',
      treatmentItems: treatment.items.map((i) => i.text),
      nextVisit: treatment.nextVisit ? treatment.nextVisit.toISOString().slice(0, 10) : '',
    },
  })
}
