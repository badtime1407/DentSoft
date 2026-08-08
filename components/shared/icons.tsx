const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function IconGrid({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  )
}

export function IconCalendar({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
  )
}

export function IconUsers({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <circle cx="9" cy="8.5" r="3.25" />
      <path d="M3 19.5c0-3.2 2.7-5.5 6-5.5s6 2.3 6 5.5" />
      <path d="M15.5 6.2c1.6.3 2.75 1.6 2.75 3.3 0 1.4-.8 2.6-2 3.1" />
      <path d="M16.7 14.2c2.4.5 4.3 2.4 4.3 5.3" />
    </svg>
  )
}

export function IconBadge({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <circle cx="12" cy="8.5" r="4" />
      <path d="M7.5 12.7 5 21l7-3 7 3-2.5-8.3" />
    </svg>
  )
}

export function IconChartBar({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M4 20V10M12 20V4M20 20v-6" />
    </svg>
  )
}

export function IconClock({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}

export function IconPulse({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M3 12h4l2-6 4 12 2-6h6" />
    </svg>
  )
}

export function IconCheckCircle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.3l2.4 2.4 4.6-5.2" />
    </svg>
  )
}

export function IconXCircle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" />
    </svg>
  )
}

export function IconWallet({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <rect x="3" y="6.5" width="18" height="13" rx="2.2" />
      <path d="M3 10.5h18" />
      <circle cx="16.2" cy="14.3" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconUserCheck({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <circle cx="9.5" cy="8.5" r="3.25" />
      <path d="M3.5 19.5c0-3.2 2.7-5.5 6-5.5s6 2.3 6 5.5" />
      <path d="M16.5 11.5l1.8 1.8 3.2-3.4" />
    </svg>
  )
}

export function IconCalendarPlus({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
      <path d="M12 13.2v5M9.5 15.7h5" />
    </svg>
  )
}

export function IconCreditCard({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <rect x="2.75" y="5.5" width="18.5" height="13" rx="2.2" />
      <path d="M2.75 9.7h18.5" />
      <path d="M6 14.8h4" />
    </svg>
  )
}

export function IconClipboardList({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <rect x="5" y="4.5" width="14" height="16.5" rx="2" />
      <path d="M9 3.5h6a1 1 0 0 1 1 1V6H8V4.5a1 1 0 0 1 1-1Z" />
      <path d="M8.5 12h7M8.5 15.5h7M8.5 8.7h3" />
    </svg>
  )
}

export function IconLogout({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M9 4.5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h3" />
      <path d="M13 8l4 4-4 4M17 12H9" />
    </svg>
  )
}

export function IconSearch({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.8-4.8" />
    </svg>
  )
}

export function IconRotate({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" />
      <path d="M18 3v4h-4M6 21v-4h4" />
    </svg>
  )
}

export function IconChevronLeft({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  )
}

export function IconChevronRight({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  )
}

export function IconPlus({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function IconX({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function IconPhone({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M5.5 4.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3c0 1.1-.9 2-2 2A16 16 0 0 1 3.5 6.5c0-1.1.9-2 2-2Z" />
    </svg>
  )
}

export function IconTooth({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M12 3.5c-1.6 0-2.4.9-3.6.9-1.9 0-3.4 1.7-3.4 4.3 0 2.4.6 4.8 1.4 6.8.6 1.5 1 3.5 2.2 3.5.9 0 .9-2.3 1.6-3.7.4-.8.8-1.3 1.8-1.3s1.4.5 1.8 1.3c.7 1.4.7 3.7 1.6 3.7 1.2 0 1.6-2 2.2-3.5.8-2 1.4-4.4 1.4-6.8 0-2.6-1.5-4.3-3.4-4.3-1.2 0-2-.9-3.6-.9Z" />
    </svg>
  )
}

export function IconFileText({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M7 3.5h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5V7a1 1 0 0 0 1 1h3.5" />
      <path d="M8.5 12.5h7M8.5 15.7h7M8.5 18.9h4.5" />
    </svg>
  )
}

export function IconAlertTriangle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M12 4 2.5 20.5h19L12 4Z" />
      <path d="M12 10v4.2" />
      <circle cx="12" cy="17.3" r="0.15" fill="currentColor" stroke="none" />
    </svg>
  )
}
