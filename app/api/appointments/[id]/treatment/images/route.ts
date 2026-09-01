import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5MB

function parseDataUrl(dataUrl: string): { mimeType: string; buffer: Uint8Array<ArrayBuffer> } | null {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl)
  if (!match) return null
  return { mimeType: match[1], buffer: Uint8Array.from(Buffer.from(match[2], 'base64')) }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
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

  const { image } = await req.json()
  if (typeof image !== 'string') {
    return NextResponse.json({ error: 'ไม่พบไฟล์รูปภาพ' }, { status: 400 })
  }

  const parsed = parseDataUrl(image)
  if (!parsed) {
    return NextResponse.json({ error: 'รูปแบบไฟล์ไม่ถูกต้อง ต้องเป็นไฟล์รูปภาพ' }, { status: 400 })
  }
  if (parsed.buffer.byteLength > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: 'ไฟล์รูปภาพใหญ่เกินไป (สูงสุด 5MB)' }, { status: 400 })
  }

  const treatment = await prisma.treatment.upsert({
    where: { appointmentId: id },
    update: {},
    create: { appointmentId: id },
  })

  const treatmentImage = await prisma.treatmentImage.create({
    data: { treatmentId: treatment.id, data: parsed.buffer, mimeType: parsed.mimeType },
  })

  return NextResponse.json({ id: treatmentImage.id, url: `/api/treatment-images/${treatmentImage.id}` })
}
