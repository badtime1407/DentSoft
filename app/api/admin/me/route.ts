import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  const user = session?.user as { id?: string; role?: string; email?: string } | undefined

  if (!session || user?.role !== 'ADMIN' || !user?.id) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบด้วยบัญชีแอดมิน' }, { status: 401 })
  }

  const record = await prisma.user.findUnique({ where: { id: user.id }, select: { username: true, avatarData: true } })
  if (!record) {
    return NextResponse.json({ error: 'ไม่พบบัญชีนี้' }, { status: 404 })
  }

  return NextResponse.json({
    email: user.email,
    username: record.username,
    avatarUrl: record.avatarData ? `/api/avatar/${user.id}` : null,
  })
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { id?: string; role?: string } | undefined

  if (!session || user?.role !== 'ADMIN' || !user?.id) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบด้วยบัญชีแอดมิน' }, { status: 401 })
  }

  const { username } = await req.json()
  if (typeof username !== 'string' || !username.trim()) {
    return NextResponse.json({ error: 'กรุณาระบุ Username' }, { status: 400 })
  }

  const trimmed = username.trim()
  const existing = await prisma.user.findUnique({ where: { username: trimmed } })
  if (existing && existing.id !== user.id) {
    return NextResponse.json({ error: 'Username นี้ถูกใช้งานแล้ว' }, { status: 400 })
  }

  const updated = await prisma.user.update({ where: { id: user.id }, data: { username: trimmed } })

  return NextResponse.json({ username: updated.username })
}
