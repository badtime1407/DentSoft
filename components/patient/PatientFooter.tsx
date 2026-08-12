'use client'

export function PatientFooter() {
  return (
    <footer className="bg-white border-t border-slate-100 py-6 mt-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        {/* Brand */}
        <div>
          <span className="font-extrabold text-[#0066ff] text-base">DentSoft</span>{' '}
          <span className="text-xs font-semibold text-[#0066ff]/80">Clinic</span>
        </div>

        {/* Copyright */}
        <p className="text-slate-400 text-center">
          © 2024 DentSoft Clinic. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
