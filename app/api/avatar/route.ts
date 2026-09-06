import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const MAX_IMAGE_BYTES = 3 * 1024 * 1024 // 3MB

function parseDataUrl(dataUrl: string): { mimeType: string; buffer: Uint8Array<ArrayBuffer> } | null {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl)
  if (!match) return null
  return { mimeType: match[1], buffer: Uint8Array.from(Buffer.from(match[2], 'base64')) }
}

// อัปโหลด/ลบรูปโปรไฟล์ของบัญชีตัวเอง ใช้ได้ทุก role เพราะ avatar เป็นข้อมูลระดับ User ไม่ผูกกับบทบาท
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { id?: string } | undefined

  if (!session || !user?.id) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 })
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
    return NextResponse.json({ error: 'ไฟล์รูปภาพใหญ่เกินไป (สูงสุด 3MB)' }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { avatarData: parsed.buffer, avatarMimeType: parsed.mimeType },
  })

  return NextResponse.json({ avatarUrl: `/api/avatar/${user.id}?t=${Date.now()}` })
}

export async function DELETE() {
  const session = await getServerSession(authOptions)
  const user = session?.user as { id?: string } | undefined

  if (!session || !user?.id) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { avatarData: null, avatarMimeType: null },
  })

  return NextResponse.json({ success: true })
}
