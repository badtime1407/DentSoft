import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string } | undefined)?.role
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'ต้องเข้าสู่ระบบด้วยบัญชีแอดมิน' }, { status: 401 })
  }

  const { id } = await params
  const { firstName, lastName, phone, birthDate, allergyNote } = await req.json()

  if (!firstName || !lastName) {
    return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 })
  }

  const existing = await prisma.patient.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'ไม่พบคนไข้นี้' }, { status: 404 })
  }

  const patient = await prisma.patient.update({
    where: { id },
    data: {
      firstName,
      lastName,
      phone: phone || null,
      birthDate: birthDate ? new Date(birthDate) : null,
      allergyNote: allergyNote || null,
    },
  })

  return NextResponse.json({
    patient: {
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      phone: patient.phone,
      birthDate: patient.birthDate ? patient.birthDate.toISOString().slice(0, 10) : null,
      source: patient.source,
      allergyNote: patient.allergyNote,
    },
  })
}
