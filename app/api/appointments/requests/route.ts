import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000

function toBangkok(date: Date) {
  return new Date(date.getTime() + BANGKOK_OFFSET_MS)
}

function formatBangkokDate(date: Date) {
  return toBangkok(date).toISOString().slice(0, 10)
}

function formatBangkokTime(date: Date) {
  const bangkok = toBangkok(date)
  return `${String(bangkok.getUTCHours()).padStart(2, '0')}:${String(bangkok.getUTCMinutes()).padStart(2, '0')}`
}

export async function GET() {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string } | undefined)?.role
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'ต้องเข้าสู่ระบบด้วยบัญชีแอดมิน' }, { status: 401 })
  }

  const appointments = await prisma.appointment.findMany({
    where: { requestType: { not: null } },
    include: { patient: true, service: true, dentist: true },
    orderBy: { requestedAt: 'desc' },
  })

  const requests = appointments.map((a) => ({
    id: a.id,
    appointmentId: a.id,
    patientName: `${a.patient.firstName} ${a.patient.lastName}`,
    date: formatBangkokDate(a.date),
    startTime: formatBangkokTime(a.date),
    serviceName: a.service.name,
    dentistName: a.dentist ? `${a.dentist.title} ${a.dentist.firstName} ${a.dentist.lastName}` : 'ยังไม่ได้มอบหมายทันตแพทย์',
    type: a.requestType,
    reason: a.requestReason ?? '',
    requestedAt: a.requestedAt ? formatBangkokTime(a.requestedAt) + ' น.' : '',
  }))

  return NextResponse.json({ requests })
}
