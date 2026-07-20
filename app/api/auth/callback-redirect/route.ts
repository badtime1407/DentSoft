import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function GET() {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role

  if (role === 'ADMIN') {
    redirect('/admin/dashboard')
  } else if (role === 'DENTIST') {
    redirect('/dentist/dashboard')
  } else {
    redirect('/patient/dashboard')
  }
}