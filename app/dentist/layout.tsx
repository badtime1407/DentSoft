import { DentistSidebar } from '@/components/dentist/DentistSidebar'
import { DentistHeader } from '@/components/dentist/DentistHeader'
import { QueueProvider } from '@/components/dentist/QueueProvider'

export default function DentistLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueueProvider>
      <div className="flex min-h-screen bg-slate-50 text-slate-800">
        <DentistSidebar />
        <div className="flex-1 ml-60 flex flex-col min-w-0">
          <DentistHeader />
          <main className="flex-1 px-8 py-8 max-w-[1440px]">{children}</main>
        </div>
      </div>
    </QueueProvider>
  )
}
