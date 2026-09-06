import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { CancelRequestsProvider } from '@/components/admin/CancelRequestsProvider'
import { MobileSidebarProvider } from '@/components/shared/MobileSidebarContext'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <CancelRequestsProvider>
      <MobileSidebarProvider>
        <div className="flex min-h-screen bg-slate-50 text-slate-800">
          <AdminSidebar />
          <div className="flex-1 lg:ml-60 flex flex-col min-w-0">
            <AdminHeader />
            <main className="flex-1 px-4 sm:px-8 py-8 max-w-[1440px]">{children}</main>
          </div>
        </div>
      </MobileSidebarProvider>
    </CancelRequestsProvider>
  )
}
