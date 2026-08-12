import Image from 'next/image'
import type { ReactNode } from 'react'
import { AuthBackdrop } from './AuthBackdrop'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_#ffffff_0%,_#eef6fd_55%,_#e0eefc_100%)] p-6 overflow-hidden">
      <AuthBackdrop />
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white/55 backdrop-blur-2xl rounded-3xl shadow-xl overflow-hidden">
        <div className="hidden lg:flex flex-col p-4 bg-gradient-to-br from-blue-400 to-blue-700 text-white relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-xl" />
          <div className="absolute bottom-24 -right-10 w-48 h-48 rounded-full bg-white/10 blur-xl" />
          <svg viewBox="0 0 200 200" className="absolute -bottom-12 -left-10 w-56 h-56 text-white opacity-[0.06] rotate-12" aria-hidden="true">
            <path
              d="M100 30c-13 0-20 7-30 7-16 0-28 14-28 36 0 20 5 40 12 57 5 12 8 29 18 29 8 0 8-19 13-31 3-7 7-11 15-11s12 4 15 11c5 12 5 31 13 31 10 0 13-17 18-29 7-17 12-37 12-57 0-22-12-36-28-36-10 0-17-7-30-7Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full text-white opacity-[0.08]" aria-hidden="true">
            <path d="M-20,60 C80,20 160,90 280,50 S420,20 460,60" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>

          <div className="relative z-10 flex flex-1 items-center justify-center">
            <div className="relative w-120 h-80">
              <Image src="/logodentsoftonlytext.png" alt="DentSoft" fill className="object-contain" />
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
