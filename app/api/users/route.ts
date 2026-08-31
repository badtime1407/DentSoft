import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { username, email, password, firstName, lastName, phone, birthDate, linkPatientId } = await req.json()

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Email หรือ Username นี้ถูกใช้งานแล้ว' },
        { status: 400 }
      )
    }

    if (linkPatientId) {
      const existingPatient = await prisma.patient.findUnique({ where: { id: linkPatientId } })
      if (!existingPatient || existingPatient.userId || existingPatient.phone !== phone) {
        return NextResponse.json({ error: 'ไม่สามารถเชื่อมโยงประวัติคนไข้นี้ได้' }, { status: 400 })
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = linkPatientId
      ? await prisma.user.create({
          data: { username, email, password: hashedPassword, role: 'PATIENT' },
        })
      : await prisma.user.create({
          data: {
            username,
            email,
            password: hashedPassword,
            role: 'PATIENT',
            patient: {
              create: {
                firstName,
                lastName,
                phone,
                birthDate: birthDate ? new Date(birthDate) : null,
              },
            },
          },
        })

    if (linkPatientId) {
      await prisma.patient.update({
        where: { id: linkPatientId },
        data: { userId: user.id, source: 'ONLINE' },
      })
    }

    return NextResponse.json({ message: 'สมัครสมาชิกสำเร็จ' }, { status: 201 })
  } catch (error) {
    console.error('Register error:', error)  // เพิ่มตรงนี้
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}