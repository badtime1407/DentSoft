import Image from 'next/image'
import type { ReactNode } from 'react'
import { ParticleBackground } from './ParticleBackground'

const badges = [
  {
    label: 'Smart Scheduling',
    icon: (
      <>
        <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
        <path d="M8 3v4M16 3v4M3.5 10h17" />
      </>
    ),
  },
  {
    label: 'Clinical Records',
    icon: (
      <path d="M12 3c-2.5 0-4 1.5-6 1.5-3 0-5.5 3-5.5 7.5 0 4 1 8 2.5 11.5 1 2.5 1.5 5.5 3.5 5.5s1.5-3.5 2.5-6c.5-1.5 1.5-2 3-2s2.5.5 3 2c1 2.5 1 6 2.5 6s2.5-3 3.5-5.5c1.5-3.5 2.5-7.5 2.5-11.5C21.5 6 19 3 16 3c-2 0-3.5-1.5-6-1.5" />
    ),
  },
]

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 p-6 overflow-hidden">
      <ParticleBackground />
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="hidden lg:flex flex-col p-10 bg-gradient-to-br from-blue-400 to-blue-700 text-white relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-xl" />
          <div className="absolute bottom-24 -right-10 w-48 h-48 rounded-full bg-white/10 blur-xl" />

          <div className="relative z-10 flex flex-col items-center text-center mt-6">
            <div className="relative w-36 h-24 bg-white rounded-2xl shadow-lg mb-6 p-3">
              <Image src="/LogoDentSoft.png" alt="DentSoft" fill className="object-contain p-2" />
            </div>
            <p className="text-blue-50 text-sm leading-relaxed max-w-xs">
              ระบบบริหารจัดการคลินิกทันตกรรมที่ใส่ใจในทุกรายละเอียด
              พร้อมมอบความอบอุ่นใจให้คนไข้ทุกคน
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-3 my-8">
            {badges.map((badge) => (
              <div key={badge.label} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl px-3 py-3 flex flex-col items-center gap-1.5 text-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  {badge.icon}
                </svg>
                <span className="text-xs font-medium text-blue-50">{badge.label}</span>
              </div>
            ))}
          </div>

          <div className="relative z-10 mt-auto rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 21v-8a8 8 0 0 1 16 0v8" />
                <path d="M2 21h20" />
                <path d="M9 21v-5a3 3 0 0 1 6 0v5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold">DentSoft Clinic</p>
              <p className="text-xs text-blue-100">ดูแลโดยทีมทันตแพทย์มืออาชีพ</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">{children}</div>
          <div className="mt-10 flex items-center gap-5 text-xs text-gray-400">
            <a href="#" className="hover:text-blue-600 transition">Privacy Policy</a>
            <span className="text-gray-200">|</span>
            <a href="#" className="hover:text-blue-600 transition">Terms of Service</a>
            <span className="text-gray-200">|</span>
            <a href="#" className="hover:text-blue-600 transition">Contact Support</a>
          </div>
        </div>
      </div>
    </div>
  )
}
