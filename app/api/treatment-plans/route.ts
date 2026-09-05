import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { id?: string; role?: string } | undefined
  if (!session || user?.role !== 'DENTIST' || !user?.id) {
    return NextResponse.json({ error: 'ต้องเข้าสู่ระบบด้วยบัญชีทันตแพทย์' }, { status: 401 })
  }

  const dentist = await prisma.dentist.findUnique({ where: { userId: user.id } })
  if (!dentist) {
    return NextResponse.json({ error: 'ไม่พบข้อมูลทันตแพทย์ของบัญชีนี้' }, { status: 404 })
  }

  const { patientId, title, steps } = await req.json()

  if (typeof patientId !== 'string' || typeof title !== 'string' || !title.trim()) {
    return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 })
  }

  const patient = await prisma.patient.findUnique({ where: { id: patientId } })
  if (!patient) {
    return NextResponse.json({ error: 'ไม่พบคนไข้นี้' }, { status: 404 })
  }

  const stepDescriptions: string[] = Array.isArray(steps)
    ? steps.filter((s): s is string => typeof s === 'string' && s.trim() !== '')
    : []

  const plan = await prisma.treatmentPlan.create({
    data: {
      patientId,
      title: title.trim(),
      createdByDentistId: dentist.id,
      steps: {
        create: stepDescriptions.map((description, index) => ({ order: index, description, createdByDentistId: dentist.id })),
      },
    },
    include: { steps: { orderBy: { order: 'asc' } } },
  })

  return NextResponse.json({
    plan: {
      id: plan.id,
      title: plan.title,
      status: plan.status,
      createdByDentistId: plan.createdByDentistId,
      steps: plan.steps.map((s) => ({
        id: s.id,
        order: s.order,
        description: s.description,
        isDone: s.isDone,
        appointmentId: s.appointmentId,
        createdByDentistId: s.createdByDentistId,
      })),
    },
  })
}
