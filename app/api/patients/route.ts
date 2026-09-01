import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type RecallStatus = 'ON_TRACK' | 'DUE_SOON' | 'OVERDUE' | 'NEW'

function classifyRecall(daysSinceVisit: number | null): RecallStatus {
  if (daysSinceVisit === null) return 'NEW'
  if (daysSinceVisit >= 210) return 'OVERDUE'
  if (daysSinceVisit >= 165) return 'DUE_SOON'
  return 'ON_TRACK'
}

export async function GET() {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string } | undefined)?.role
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'ต้องเข้าสู่ระบบด้วยบัญชีแอดมิน' }, { status: 401 })
  }

  const now = new Date()

  const patients = await prisma.patient.findMany({
    where: { OR: [{ userId: null }, { user: { role: 'PATIENT' } }] },
    include: { appointments: { include: { service: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const result = patients.map((p) => {
    const completed = p.appointments
      .filter((a) => a.status === 'COMPLETED')
      .sort((a, b) => b.date.getTime() - a.date.getTime())
    const lastVisit = completed[0]?.date ?? null

    const upcoming = p.appointments
      .filter((a) => a.status !== 'CANCELLED' && a.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
    const next = upcoming[0]

    const daysSinceVisit = lastVisit ? Math.floor((now.getTime() - lastVisit.getTime()) / 86400000) : null

    return {
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      phone: p.phone,
      birthDate: p.birthDate ? p.birthDate.toISOString().slice(0, 10) : null,
      source: p.source,
      allergyNote: p.allergyNote,
      registeredDate: p.createdAt.toISOString().slice(0, 10),
      lastVisitDate: lastVisit ? lastVisit.toISOString().slice(0, 10) : null,
      nextAppointmentDate: next ? next.date.toISOString().slice(0, 10) : null,
      nextAppointmentLabel: next ? next.service.name : null,
      recallStatus: classifyRecall(daysSinceVisit),
    }
  })

  return NextResponse.json({ patients: result })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string } | undefined)?.role
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'ต้องเข้าสู่ระบบด้วยบัญชีแอดมิน' }, { status: 401 })
  }

  const { firstName, lastName, phone, birthDate, allergyNote } = await req.json()

  if (!firstName || !lastName) {
    return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 })
  }

  const patient = await prisma.patient.create({
    data: {
      firstName,
      lastName,
      phone: phone || null,
      birthDate: birthDate ? new Date(birthDate) : null,
      allergyNote: allergyNote || null,
      source: 'WALK_IN',
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
      registeredDate: patient.createdAt.toISOString().slice(0, 10),
      lastVisitDate: null,
      nextAppointmentDate: null,
      nextAppointmentLabel: null,
      recallStatus: 'NEW',
    },
  })
}
