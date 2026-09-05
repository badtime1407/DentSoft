import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string; stepId: string }> }) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string } | undefined)?.role
  if (role !== 'DENTIST') {
    return NextResponse.json({ error: 'ต้องเข้าสู่ระบบด้วยบัญชีทันตแพทย์' }, { status: 401 })
  }

  const { id, stepId } = await params
  const existing = await prisma.treatmentPlanStep.findUnique({ where: { id: stepId } })
  if (!existing || existing.planId !== id) {
    return NextResponse.json({ error: 'ไม่พบขั้นตอนนี้' }, { status: 404 })
  }

  const { description, isDone } = await req.json()

  const step = await prisma.treatmentPlanStep.update({
    where: { id: stepId },
    data: {
      ...(typeof description === 'string' && description.trim() ? { description: description.trim() } : {}),
      ...(typeof isDone === 'boolean' ? { isDone } : {}),
    },
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

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string; stepId: string }> }) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { id?: string; role?: string } | undefined
  if (!session || user?.role !== 'DENTIST' || !user?.id) {
    return NextResponse.json({ error: 'ต้องเข้าสู่ระบบด้วยบัญชีทันตแพทย์' }, { status: 401 })
  }

  const dentist = await prisma.dentist.findUnique({ where: { userId: user.id } })
  if (!dentist) {
    return NextResponse.json({ error: 'ไม่พบข้อมูลทันตแพทย์ของบัญชีนี้' }, { status: 404 })
  }

  const { id, stepId } = await params
  const existing = await prisma.treatmentPlanStep.findUnique({ where: { id: stepId } })
  if (!existing || existing.planId !== id) {
    return NextResponse.json({ error: 'ไม่พบขั้นตอนนี้' }, { status: 404 })
  }
  if (existing.createdByDentistId !== dentist.id) {
    return NextResponse.json({ error: 'ลบได้เฉพาะขั้นตอนที่คุณเป็นคนเพิ่มเท่านั้น' }, { status: 403 })
  }

  await prisma.treatmentPlanStep.delete({ where: { id: stepId } })
  return NextResponse.json({ success: true })
}
