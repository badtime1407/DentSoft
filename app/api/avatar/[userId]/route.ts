import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 })
  }

  const { userId } = await params
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { avatarData: true, avatarMimeType: true } })

  if (!user || !user.avatarData || !user.avatarMimeType) {
    return NextResponse.json({ error: 'ไม่พบรูปโปรไฟล์นี้' }, { status: 404 })
  }

  return new NextResponse(user.avatarData, {
    headers: {
      'Content-Type': user.avatarMimeType,
      'Cache-Control': 'private, max-age=31536000, immutable',
    },
  })
}
