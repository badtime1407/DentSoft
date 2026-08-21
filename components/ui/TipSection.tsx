/* eslint-disable @next/next/no-img-element */
import { focusRing } from '@/lib/shared/focus-ring'

export default function TipSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-4">
      <div className="relative rounded-2xl overflow-hidden border border-slate-100/90 shadow-sm bg-blue-50 min-h-[190px] sm:min-h-[220px] flex items-center">
        <img
          src="/11.jpg"
          alt="Dental Care Tip Background"
          className="absolute inset-0 w-full h-full object-cover object-right select-none pointer-events-none"
        />

        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 max-w-3xl">
          <div className="w-28 h-28 sm:w-36 sm:h-36 shrink-0 relative">
            <img
              src="/33.png"
              alt="Tooth Shield Graphic"
              className="w-full h-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="space-y-2.5 text-left">
            <h3 className="text-blue-600 font-extrabold text-xl sm:text-2xl tracking-tight">
              เคล็ดลับดูแลสุขภาพช่องปาก
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
              แปรงฟันอย่างน้อยวันละ 2 ครั้ง ครั้งละ 2 นาที
              <br />
              และใช้ไหมขัดฟันเป็นประจำทุกวัน
            </p>
            <div className="pt-1.5">
              <a
                href="#services"
                className={`inline-block px-5 py-2 border border-blue-600 text-blue-600 bg-blue-50/90 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm ${focusRing}`}
              >
                อ่านเพิ่มเติม
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
