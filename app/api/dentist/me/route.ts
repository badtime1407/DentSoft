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

  const userRecord = await prisma.user.findUnique({ where: { id: user.id }, select: { avatarData: true } })

  return NextResponse.json({
    id: dentist.id,
    title: dentist.title,
    firstName: dentist.firstName,
    lastName: dentist.lastName,
    name: `${dentist.title}${dentist.firstName} ${dentist.lastName}`,
    specialty: dentist.specialty,
    phone: dentist.phone,
    email: user.email,
    avatarUrl: userRecord?.avatarData ? `/api/avatar/${user.id}` : null,
  })
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { id?: string; role?: string } | undefined

  if (!session || user?.role !== 'DENTIST' || !user?.id) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบด้วยบัญชีทันตแพทย์' }, { status: 401 })
  }

  const { title, firstName, lastName, specialty, phone } = await req.json()

  if (!firstName || !lastName) {
    return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 })
  }

  const existing = await prisma.dentist.findUnique({ where: { userId: user.id } })
  if (!existing) {
    return NextResponse.json({ error: 'ไม่พบข้อมูลทันตแพทย์ของบัญชีนี้' }, { status: 404 })
  }

  const dentist = await prisma.dentist.update({
    where: { userId: user.id },
    data: {
      title: title || 'ทพ.',
      firstName,
      lastName,
      specialty: specialty || null,
      phone: phone || null,
    },
  })

  return NextResponse.json({
    title: dentist.title,
    firstName: dentist.firstName,
    lastName: dentist.lastName,
    specialty: dentist.specialty,
    phone: dentist.phone,
  })
}
