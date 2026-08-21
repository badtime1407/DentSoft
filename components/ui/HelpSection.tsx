/* eslint-disable @next/next/no-img-element */
import { IconHeadset } from '@/components/shared/icons'
import { focusRing } from '@/lib/shared/focus-ring'

export default function HelpSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="bg-[#f8fafc] rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-100/90 shadow-sm relative overflow-hidden min-h-[140px]">
        <div className="flex items-center gap-6 z-10">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm hover:scale-105 transition-transform duration-300">
            <IconHeadset className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <div className="space-y-1.5">
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
              ต้องการความช่วยเหลือ?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              ติดต่อเราได้ทุกช่องทาง
            </p>
            <div className="pt-1">
              <a
                href="#footer"
                className={`inline-block px-5 py-1.5 border border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm ${focusRing}`}
              >
                ติดต่อคลินิก
              </a>
            </div>
          </div>
        </div>

        <div className="relative shrink-0 z-10">
          <img
            src="/99.png"
            alt="Need Help Graphic"
            className="w-32 h-28 sm:w-40 sm:h-36 object-contain pointer-events-none select-none drop-shadow-sm"
          />
        </div>
      </div>
    </section>
  )
}
