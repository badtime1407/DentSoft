// import { withAuth } from 'next-auth/middleware'
// import { NextResponse } from 'next/server'

// export default withAuth(
//   function middleware(req) {
//     const token = req.nextauth.token
//     const pathname = req.nextUrl.pathname
//     const role = token?.role as string

//     if (pathname.startsWith('/admin') && role !== 'ADMIN') {
//       return NextResponse.redirect(new URL('/login', req.url))
//     }

//     if (pathname.startsWith('/dentist') && role !== 'DENTIST') {
//       return NextResponse.redirect(new URL('/login', req.url))
//     }

//     if (pathname.startsWith('/patient') && role !== 'PATIENT') {
//       return NextResponse.redirect(new URL('/login', req.url))
//     }

//     return NextResponse.next()
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//   }
// )

// export const config = {
//   matcher: [
//     '/admin/:path*',
//     '/dentist/:path*',
//     '/patient/:path*',
//   ],
// }

import { NextResponse } from 'next/server'
export function middleware() {
  return NextResponse.next()
}
export const config = { matcher: [] }