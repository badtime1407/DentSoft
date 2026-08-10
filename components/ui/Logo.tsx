import Link from 'next/link'
import Image from 'next/image'

const sizeConfig = {
  sm: { box: 'h-7 w-[71px]' },
  md: { box: 'h-9 w-[92px]' },
}

export function Logo({ size = 'md', className = '' }: { size?: 'sm' | 'md'; className?: string }) {
  const cfg = sizeConfig[size]
  return (
    <Link href="/" className={`relative shrink-0 ${cfg.box} ${className}`}>
      <Image src="/LogoDentSoft.png" alt="DentSoft" fill className="object-contain object-left" />
    </Link>
  )
}
