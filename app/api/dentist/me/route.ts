import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  const user = session?.user as { id?: string; role?: string; email?: string } | undefined

  if (!session || user?.role !== 'DENTIST' || !user?.id) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบด้วยบัญชีทันตแพทย์' }, { status: 401 })
  }

  const dentist = await prisma.dentist.findUnique({ where: { userId: user.id } })
  if (!dentist) {
    return NextResponse.json({ error: 'ไม่พบข้อมูลทันตแพทย์ของบัญชีนี้' }, { status: 404 })
  }

  return NextResponse.json({
    id: dentist.id,
    title: dentist.title,
    firstName: dentist.firstName,
    lastName: dentist.lastName,
    name: `${dentist.title}${dentist.firstName} ${dentist.lastName}`,
    specialty: dentist.specialty,
    email: user.email,
  })
}
