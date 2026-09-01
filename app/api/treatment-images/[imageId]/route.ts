import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: Promise<{ imageId: string }> }) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { id?: string; role?: string } | undefined

  if (!session || !user?.id) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 })
  }

  const { imageId } = await params
  const image = await prisma.treatmentImage.findUnique({
    where: { id: imageId },
    include: { treatment: { include: { appointment: true } } },
  })

  if (!image) {
    return NextResponse.json({ error: 'ไม่พบรูปภาพนี้' }, { status: 404 })
  }

  if (user.role === 'DENTIST') {
    const dentist = await prisma.dentist.findUnique({ where: { userId: user.id } })
    if (!dentist || image.treatment.appointment.dentistId !== dentist.id) {
      return NextResponse.json({ error: 'ไม่พบรูปภาพนี้' }, { status: 404 })
    }
  } else if (user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return new NextResponse(image.data, {
    headers: {
      'Content-Type': image.mimeType,
      'Cache-Control': 'private, max-age=31536000, immutable',
    },
  })
}
