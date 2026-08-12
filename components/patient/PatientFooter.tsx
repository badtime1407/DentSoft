'use client'

export function PatientFooter() {
  return (
    <footer className="bg-white border-t border-slate-100 py-6 mt-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        {/* Brand (Text only, No Icon) */}
        <div>
          <span className="font-extrabold text-[#0066ff] text-base">DentSoft</span>{' '}
          <span className="text-xs font-semibold text-[#0066ff]/80">Clinic</span>
        </div>

        {/* Copyright */}
        <p className="text-slate-400 text-center">
          © 2024 DentSoft Clinic. All rights reserved.
        </p>

        {/* Channels (Text only, No Icons) */}
        <div className="flex items-center gap-4 font-medium text-slate-600">
          <a href="#facebook" className="hover:text-[#0066ff] transition">
            Facebook
          </a>
          <a href="#line" className="hover:text-emerald-600 transition">
            LINE
          </a>
          <a href="tel:021234567" className="hover:text-[#0066ff] transition">
            โทรศัพท์
          </a>
        </div>
      </div>
    </footer>
  )
}
