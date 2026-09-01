import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string; imageId: string }> }) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { id?: string; role?: string } | undefined

  if (!session || user?.role !== 'DENTIST' || !user?.id) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบด้วยบัญชีทันตแพทย์' }, { status: 401 })
  }

  const { id, imageId } = await params
  const dentist = await prisma.dentist.findUnique({ where: { userId: user.id } })
  const image = await prisma.treatmentImage.findUnique({
    where: { id: imageId },
    include: { treatment: { include: { appointment: true } } },
  })

  if (
    !image ||
    image.treatment.appointmentId !== id ||
    !dentist ||
    image.treatment.appointment.dentistId !== dentist.id
  ) {
    return NextResponse.json({ error: 'ไม่พบรูปภาพนี้' }, { status: 404 })
  }

  await prisma.treatmentImage.delete({ where: { id: imageId } })

  return NextResponse.json({ success: true })
}
