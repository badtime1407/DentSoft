import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const user = await prisma.user.findUnique({
      where: { email },
    })

    // ไม่บอกว่า email มีหรือไม่มีในระบบ เพื่อความปลอดภัย
    if (!user) {
      return NextResponse.json({ message: 'หากมีบัญชีนี้ในระบบ เราจะส่งลิงก์ไปให้' })
    }

    // สร้าง token สำหรับ reset
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 1000 * 60 * 60) // หมดอายุใน 1 ชั่วโมง

    // บันทึก token ลง Database
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    })

    // ส่ง Email
    await resend.emails.send({
      from: 'Dentsoft <onboarding@resend.dev>',
      to: email,
      subject: 'รีเซ็ตรหัสผ่าน Dentsoft',
      html: `
        <h2>รีเซ็ตรหัสผ่าน</h2>
        <p>กดลิงก์ด้านล่างเพื่อรีเซ็ตรหัสผ่านของคุณ</p>
        <a href="${process.env.NEXTAUTH_URL}/reset-password?token=${token}">
          คลิกที่นี่เพื่อรีเซ็ตรหัสผ่าน
        </a>
        <p>ลิงก์นี้จะหมดอายุใน 1 ชั่วโมง</p>
      `,
    })

    return NextResponse.json({ message: 'หากมีบัญชีนี้ในระบบ เราจะส่งลิงก์ไปให้' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}