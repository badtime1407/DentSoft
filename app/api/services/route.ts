import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const services = await prisma.service.findMany({
    where: { isActive: true, type: { in: ['MAIN', 'PACKAGE'] } },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  })

  return NextResponse.json({ services })
}
