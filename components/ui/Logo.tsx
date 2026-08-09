import Link from 'next/link'

const sizeConfig = {
  sm: { box: 'w-7 h-7 rounded-lg', letter: 'text-sm', text: 'text-base' },
  md: { box: 'w-8 h-8 rounded-xl', letter: 'text-base', text: 'text-lg' },
}

export function Logo({ size = 'md', className = '' }: { size?: 'sm' | 'md'; className?: string }) {
  const cfg = sizeConfig[size]
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className={`${cfg.box} bg-blue-600 flex items-center justify-center shrink-0`}>
        <span className={`text-white font-extrabold ${cfg.letter} leading-none`}>D</span>
      </div>
      <span className={`${cfg.text} font-bold text-gray-900 tracking-tight`}>DentSoft</span>
    </Link>
  )
}
