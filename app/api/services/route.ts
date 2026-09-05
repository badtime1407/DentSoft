import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  const services = await prisma.service.findMany({
    where: {
      isActive: true,
      type: type === 'ADD_ON' ? 'ADD_ON' : { in: ['MAIN', 'PACKAGE'] },
    },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  })

  return NextResponse.json({ services })
}
