import { SiteFooter } from '@/components/shared/SiteFooter'

const quickLinks = [
  { label: 'หน้าหลัก', href: '/' },
  { label: 'บริการ', href: '/services' },
  { label: 'เข้าสู่ระบบ', href: '/login' },
  { label: 'สมัครสมาชิก', href: '/register' },
]

export default function Footer() {
  return <SiteFooter id="footer" quickLinks={quickLinks} tone="gray" containerClassName="max-w-6xl px-6" />
}
