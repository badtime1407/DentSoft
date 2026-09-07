import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { DentistSidebar } from '@/components/dentist/DentistSidebar'
import { DentistHeader } from '@/components/dentist/DentistHeader'
import { QueueProvider } from '@/components/dentist/QueueProvider'
import { MobileSidebarProvider } from '@/components/shared/MobileSidebarContext'

export default async function DentistLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string } | undefined)?.role
  if (role !== 'DENTIST') {
    redirect('/login')
  }

  return (
    <QueueProvider>
      <MobileSidebarProvider>
        <div className="flex min-h-screen bg-slate-50 text-slate-800">
          <DentistSidebar />
          <div className="flex-1 lg:ml-60 flex flex-col min-w-0">
            <DentistHeader />
            <main className="flex-1 px-4 sm:px-8 py-8 max-w-[1440px]">{children}</main>
          </div>
        </div>
      </MobileSidebarProvider>
    </QueueProvider>
  )
}
