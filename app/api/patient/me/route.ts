import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  const user = session?.user as { id?: string; role?: string; email?: string } | undefined

  if (!session || user?.role !== 'PATIENT' || !user?.id) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบด้วยบัญชีคนไข้' }, { status: 401 })
  }

  const patient = await prisma.patient.findUnique({ where: { userId: user.id } })
  if (!patient) {
    return NextResponse.json({ error: 'ไม่พบข้อมูลคนไข้ของบัญชีนี้' }, { status: 404 })
  }

  return NextResponse.json({
    firstName: patient.firstName,
    lastName: patient.lastName,
    phone: patient.phone,
    birthDate: patient.birthDate ? patient.birthDate.toISOString().slice(0, 10) : null,
    email: user.email,
  })
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { id?: string; role?: string; email?: string } | undefined

  if (!session || user?.role !== 'PATIENT' || !user?.id) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบด้วยบัญชีคนไข้' }, { status: 401 })
  }

  const { firstName, lastName, phone, birthDate } = await req.json()

  if (!firstName || !lastName) {
    return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 })
  }

  const existing = await prisma.patient.findUnique({ where: { userId: user.id } })
  if (!existing) {
    return NextResponse.json({ error: 'ไม่พบข้อมูลคนไข้ของบัญชีนี้' }, { status: 404 })
  }

  const patient = await prisma.patient.update({
    where: { userId: user.id },
    data: {
      firstName,
      lastName,
      phone: phone || null,
      birthDate: birthDate ? new Date(birthDate) : null,
    },
  })

  return NextResponse.json({
    firstName: patient.firstName,
    lastName: patient.lastName,
    phone: patient.phone,
    birthDate: patient.birthDate ? patient.birthDate.toISOString().slice(0, 10) : null,
  })
}
