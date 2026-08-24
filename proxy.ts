import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const roleDashboard: Record<string, string> = {
  ADMIN: '/admin/dashboard',
  DENTIST: '/dentist/dashboard',
  PATIENT: '/patient/dashboard',
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const role = token?.role as string | undefined

  if (pathname === '/') {
    if (role && roleDashboard[role]) {
      return NextResponse.redirect(new URL(roleDashboard[role], request.url))
    }
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (role === 'ADMIN') {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname.startsWith('/dentist') && role !== 'DENTIST') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname.startsWith('/patient') && role !== 'PATIENT') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/admin/:path*', '/dentist/:path*', '/patient/:path*'],
}
