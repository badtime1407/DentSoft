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
  const existing = await prisma.treatment.findUnique({ where: { appointmentId: id } })
  if (!existing) {
    return NextResponse.json({ error: 'ไม่พบบันทึกการรักษาของนัดหมายนี้' }, { status: 404 })
  }

  const treatment = await prisma.treatment.update({
    where: { appointmentId: id },
    data: { paymentStatus: 'PAID', paidAt: new Date() },
  })

  return NextResponse.json({
    paymentStatus: treatment.paymentStatus,
    paidAt: treatment.paidAt ? treatment.paidAt.toISOString() : null,
  })
}
