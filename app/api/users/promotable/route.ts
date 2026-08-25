import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string } | undefined)?.role
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'ต้องเข้าสู่ระบบด้วยบัญชีแอดมิน' }, { status: 401 })
  }

  const users = await prisma.user.findMany({
    where: { role: 'PATIENT', dentist: null },
    include: { patient: true },
    orderBy: { createdAt: 'asc' },
  })

  const result = users.map((u) => ({
    id: u.id,
    email: u.email,
    firstName: u.patient?.firstName ?? '',
    lastName: u.patient?.lastName ?? '',
  }))

  return NextResponse.json({ users: result })
}
