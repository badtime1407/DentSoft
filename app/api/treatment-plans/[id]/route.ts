import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string } | undefined)?.role
  if (role !== 'DENTIST') {
    return NextResponse.json({ error: 'ต้องเข้าสู่ระบบด้วยบัญชีทันตแพทย์' }, { status: 401 })
  }

  const { id } = await params
  const existing = await prisma.treatmentPlan.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'ไม่พบแผนการรักษานี้' }, { status: 404 })
  }

  const { title, status } = await req.json()
  const validStatuses = ['ACTIVE', 'COMPLETED', 'CANCELLED']

  const plan = await prisma.treatmentPlan.update({
    where: { id },
    data: {
      ...(typeof title === 'string' && title.trim() ? { title: title.trim() } : {}),
      ...(validStatuses.includes(status) ? { status } : {}),
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

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
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
  const existing = await prisma.treatmentPlan.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'ไม่พบแผนการรักษานี้' }, { status: 404 })
  }
  if (existing.createdByDentistId !== dentist.id) {
    return NextResponse.json({ error: 'ลบได้เฉพาะแผนที่คุณเป็นคนสร้างเท่านั้น' }, { status: 403 })
  }

  await prisma.treatmentPlanStep.deleteMany({ where: { planId: id } })
  await prisma.treatmentPlan.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
