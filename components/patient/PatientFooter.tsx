import { SiteFooter } from '@/components/shared/SiteFooter'

const quickLinks = [
  { label: 'หน้าหลัก', href: '/patient/dashboard' },
  { label: 'บริการทั้งหมด', href: '/patient/services' },
  { label: 'ประวัติการรักษา', href: '/patient/history' },
  { label: 'ปรึกษา AI ผู้ช่วย', href: '/patient/chat' },
]

export function PatientFooter() {
  return (
    <SiteFooter
      quickLinks={quickLinks}
      tone="slate"
      containerClassName="max-w-[1200px] px-4 sm:px-6"
      wrapperClassName="mt-16"
    />
  )
}
