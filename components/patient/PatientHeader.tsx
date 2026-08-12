'use client'

import Link from 'next/link'

export function PatientHeader() {
  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo (Text only, No Icon) */}
        <Link href="/patient/dashboard" className="flex items-center gap-2">
          <div>
            <p className="font-extrabold text-[#0066ff] text-xl leading-tight tracking-tight">DentSoft</p>
            <p className="text-[11px] font-semibold text-[#0066ff]/80 leading-none">Clinic</p>
          </div>
        </Link>

        {/* Right Section: Notification & User Profile (No Icons) */}
        <div className="flex items-center gap-4">
          {/* Notification Button */}
          <button
            type="button"
            className="relative px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
          >
            การแจ้งเตือน
            <span className="ml-1.5 px-1.5 py-0.5 bg-rose-500 text-white rounded-full text-[10px] font-bold">
              3
            </span>
          </button>

          {/* User Profile (No Icons) */}
          <div className="flex items-center gap-3 pl-2 border-l border-slate-100 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-sky-100 border border-sky-200 text-[#0066ff] font-bold text-xs flex items-center justify-center shadow-sm">
              พช
            </div>
            <span className="hidden sm:inline text-xs font-bold text-slate-800">
              สวัสดี, พิมพ์ชนก
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
