import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { phone, birthDate } = await req.json()

  if (!phone || typeof phone !== 'string') {
    return NextResponse.json({ candidates: [] })
  }

  const select = { id: true, firstName: true, lastName: true, birthDate: true } as const

  if (birthDate && typeof birthDate === 'string') {
    const exactMatches = await prisma.patient.findMany({
      where: { phone, userId: null, birthDate: new Date(birthDate) },
      select,
    })

    if (exactMatches.length > 0) {
      return NextResponse.json({
        candidates: exactMatches.map((c) => ({
          id: c.id,
          firstName: c.firstName,
          lastName: c.lastName,
          birthDate: c.birthDate ? c.birthDate.toISOString().slice(0, 10) : null,
        })),
      })
    }
  }

  const candidates = await prisma.patient.findMany({
    where: { phone, userId: null },
    select,
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
