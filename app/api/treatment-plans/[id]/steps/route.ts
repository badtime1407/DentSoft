import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { id?: string; role?: string } | undefined
  if (!session || user?.role !== 'DENTIST' || !user?.id) {
    return NextResponse.json({ error: 'ต้องเข้าสู่ระบบด้วยบัญชีทันตแพทย์' }, { status: 401 })
  }

  const dentist = await prisma.dentist.findUnique({ where: { userId: user.id } })
  if (!dentist) {
    return NextResponse.json({ error: 'ไม่พบข้อมูลทันตแพทย์ของบัญชีนี้' }, { status: 404 })
  }

  const { id } = await params
  const plan = await prisma.treatmentPlan.findUnique({ where: { id }, include: { steps: true } })
  if (!plan) {
    return NextResponse.json({ error: 'ไม่พบแผนการรักษานี้' }, { status: 404 })
  }

  const { description } = await req.json()
  if (typeof description !== 'string' || !description.trim()) {
    return NextResponse.json({ error: 'กรุณาระบุรายละเอียดขั้นตอน' }, { status: 400 })
  }

  const nextOrder = plan.steps.length > 0 ? Math.max(...plan.steps.map((s) => s.order)) + 1 : 0

  const step = await prisma.treatmentPlanStep.create({
    data: { planId: id, order: nextOrder, description: description.trim(), createdByDentistId: dentist.id },
  })

  return NextResponse.json({
    step: {
      id: step.id,
      order: step.order,
      description: step.description,
      isDone: step.isDone,
      appointmentId: step.appointmentId,
      createdByDentistId: step.createdByDentistId,
    },
  })
}
