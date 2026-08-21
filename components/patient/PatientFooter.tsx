'use client'

import Image from 'next/image'

export function PatientFooter() {
  return (
    <footer className="bg-white border-t border-slate-100 py-6 mt-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        {/* Brand */}
        <Image src="/LogoDentSoft.png" alt="DentSoft Clinic" width={350} height={138} className="h-9 w-auto" />

        {/* Copyright */}
        <p className="text-slate-400 text-center">
          © 2024 DentSoft Clinic. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
