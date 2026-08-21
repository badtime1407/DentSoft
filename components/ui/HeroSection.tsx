/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { IconCalendarPlus } from '@/components/shared/icons'
import { focusRing } from '@/lib/shared/focus-ring'

export default function HeroSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-8">
      <div className="relative rounded-2xl overflow-hidden border border-slate-100/90 shadow-sm bg-blue-50 min-h-[260px] sm:min-h-[300px] flex items-center">
        <img
          src="/44.jpg"
          alt="DentSoft Hero Banner"
          className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] object-cover object-center scale-[1.05] select-none pointer-events-none"
        />

        <div className="relative z-10 p-8 sm:p-10 max-w-xl space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            ยินดีต้อนรับสู่ DentSoft Clinic <span className="text-blue-600">💙</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed pt-1">
            ดูแลสุขภาพช่องปากของคุณ
            <br />
            ให้รอยยิ้มของคุณสดใสในทุกวัน
          </p>
          <div className="pt-3">
            <Link
              href="/login"
              className={`inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all ${focusRing}`}
            >
              <IconCalendarPlus className="w-5 h-5" />
              เข้าสู่ระบบเพื่อจองนัดหมาย
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
