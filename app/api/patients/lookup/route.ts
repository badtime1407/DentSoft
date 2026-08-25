import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { phone } = await req.json()

  if (!phone || typeof phone !== 'string') {
    return NextResponse.json({ candidates: [] })
  }

  const candidates = await prisma.patient.findMany({
    where: { phone, userId: null },
    select: { id: true, firstName: true, lastName: true, birthDate: true },
  })

  return NextResponse.json({
    candidates: candidates.map((c) => ({
      id: c.id,
      firstName: c.firstName,
      lastName: c.lastName,
      birthDate: c.birthDate ? c.birthDate.toISOString().slice(0, 10) : null,
    })),
  })
}
