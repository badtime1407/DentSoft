 import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    // หา token ใน Database
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return NextResponse.json({ error: 'Token ไม่ถูกต้องหรือหมดอายุแล้ว' }, { status: 400 })
    }

    // เช็คว่า token หมดอายุหรือยัง
    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { token } })
      return NextResponse.json({ error: 'Token หมดอายุแล้ว กรุณาขอใหม่' }, { status: 400 })
    }

    // เปลี่ยนรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { password: hashedPassword },
    })

    // ลบ token ออก
    await prisma.verificationToken.delete({ where: { token } })

    return NextResponse.json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' })
  } catch (error) {
    console.error('New password error:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}