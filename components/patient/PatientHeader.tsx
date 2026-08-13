'use client'

import Link from 'next/link'
import Image from 'next/image'

export function PatientHeader() {
  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/patient/dashboard" className="flex items-center">
          <Image src="/LogoDentSoft.png" alt="DentSoft Clinic" width={350} height={138} className="h-10 w-auto" priority />
        </Link>

        {/* Right Section: User Profile Only */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xs flex items-center justify-center shadow-sm">
            พช
          </div>
          <span className="hidden sm:inline text-xs font-bold text-slate-800">
            สวัสดี, พิมพ์ชนก
          </span>
        </div>
      </div>
    </header>
  )
}
