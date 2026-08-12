'use client'

import Link from 'next/link'

export function PatientHeader() {
  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo (Text only) */}
        <Link href="/patient/dashboard" className="flex items-center gap-2">
          <div>
            <p className="font-extrabold text-[#0066ff] text-xl leading-tight tracking-tight">DentSoft</p>
            <p className="text-[11px] font-semibold text-[#0066ff]/80 leading-none">Clinic</p>
          </div>
        </Link>

        {/* Right Section: User Profile Only */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-sky-100 border border-sky-200 text-[#0066ff] font-bold text-xs flex items-center justify-center shadow-sm">
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
