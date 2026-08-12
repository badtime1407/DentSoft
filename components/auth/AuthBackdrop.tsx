const NOISE_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const TOOTH_PATH =
  'M100 30c-13 0-20 7-30 7-16 0-28 14-28 36 0 20 5 40 12 57 5 12 8 29 18 29 8 0 8-19 13-31 3-7 7-11 15-11s12 4 15 11c5 12 5 31 13 31 10 0 13-17 18-29 7-17 12-37 12-57 0-22-12-36-28-36-10 0-17-7-30-7Z'

const plusSigns = [
  { top: '14%', left: '7%', size: 16 },
  { top: '58%', left: '4%', size: 12 },
  { top: '22%', left: '92%', size: 14 },
  { top: '78%', left: '88%', size: 18 },
]

export function AuthBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* soft brand-blue wash, top-left */}
      <div className="absolute -top-32 -left-24 w-[26rem] h-[26rem] md:w-[34rem] md:h-[34rem] rounded-full bg-[#50A6F2]/[0.16] blur-3xl motion-safe:animate-[breathe_9s_ease-in-out_infinite]" />

      {/* second soft wash, bottom-right, static for balance */}
      <div className="hidden md:block absolute -bottom-28 -right-20 w-[24rem] h-[24rem] rounded-full bg-cyan-200/55 blur-3xl" />

      {/* large tooth watermark, bottom-right */}
      <svg viewBox="0 0 200 200" className="hidden md:block absolute -bottom-20 -right-16 w-[28rem] h-[28rem] text-[#50A6F2] opacity-[0.09]">
        <path d={TOOTH_PATH} fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {/* second, smaller tooth watermark, top-left, for balance */}
      <svg viewBox="0 0 200 200" className="hidden lg:block absolute top-10 left-6 w-40 h-40 text-[#50A6F2] opacity-[0.08] -rotate-[18deg]">
        <path d={TOOTH_PATH} fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>

      {/* thin abstract curves for movement/depth */}
      <svg viewBox="0 0 800 600" className="hidden md:block absolute inset-0 w-full h-full text-[#50A6F2] opacity-[0.15]">
        <path d="M-40,120 C160,40 320,180 560,90 S820,40 900,110" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M-60,520 C140,460 300,560 540,480 S780,420 880,470" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-70" />
      </svg>

      {/* sparse small dot-pattern accents */}
      <div
        className="hidden lg:block absolute top-8 right-8 w-40 h-32 opacity-60 [mask-image:radial-gradient(ellipse,black_35%,transparent_80%)]"
        style={{ backgroundImage: 'radial-gradient(circle, #50A6F2 1.3px, transparent 1.3px)', backgroundSize: '14px 14px' }}
      />
      <div
        className="hidden lg:block absolute bottom-10 left-10 w-36 h-28 opacity-50 [mask-image:radial-gradient(ellipse,black_35%,transparent_80%)]"
        style={{ backgroundImage: 'radial-gradient(circle, #50A6F2 1.3px, transparent 1.3px)', backgroundSize: '14px 14px' }}
      />

      {/* small medical plus-sign accents */}
      {plusSigns.map((p, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="hidden md:block absolute text-[#50A6F2] opacity-[0.28]"
          style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
        >
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      ))}

      {/* fine grain for tactile premium finish */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: NOISE_URL }} />
    </div>
  )
}
