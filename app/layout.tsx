import type { Metadata } from 'next'
import { Geist, Noto_Sans_Thai } from 'next/font/google'
import './globals.css'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SessionProvider from '@/components/layouts/SessionProvider'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const notoSansThai = Noto_Sans_Thai({ subsets: ['thai'], variable: '--font-thai' })

export const metadata: Metadata = {
  title: 'Dentsoft',
  description: 'ระบบจัดการคลินิกทันตกรรม',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="th">
      <body className={`${geist.variable} ${notoSansThai.variable}`}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}