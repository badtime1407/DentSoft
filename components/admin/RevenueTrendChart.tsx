'use client'

import { useState } from 'react'

const SLOT = 28
const BAR_GAP = 6
const CHART_HEIGHT = 160

function formatShortDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
}

export function RevenueTrendChart({
  data,
  color = '#059669',
}: {
  data: { date: string; value: number }[]
  color?: string
}) {
  const [hover, setHover] = useState<number | null>(null)
  const max = Math.max(...data.map((d) => d.value), 1)
  const labelStep = Math.max(1, Math.ceil(data.length / 10))

  return (
    <div className="relative overflow-x-auto">
      <svg width={data.length * SLOT} height={CHART_HEIGHT + 28} role="img" aria-label="กราฟรายได้ตามวัน">
        {[0, 0.5, 1].map((f) => (
          <line
            key={f}
            x1={0}
            x2={data.length * SLOT}
            y1={CHART_HEIGHT * (1 - f)}
            y2={CHART_HEIGHT * (1 - f)}
            stroke="#f1f5f9"
            strokeWidth={1}
          />
        ))}
        {data.map((d, i) => {
          const barHeight = Math.max((d.value / max) * (CHART_HEIGHT - 8), 2)
          const x = i * SLOT + BAR_GAP / 2
          const width = SLOT - BAR_GAP
          return (
            <rect
              key={d.date}
              x={x}
              y={CHART_HEIGHT - barHeight}
              width={width}
              height={barHeight}
              rx={3}
              fill={color}
              opacity={hover === null || hover === i ? 1 : 0.45}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="transition-opacity cursor-pointer"
            />
          )
        })}
        {data.map((d, i) =>
          i % labelStep === 0 ? (
            <text key={d.date} x={i * SLOT + SLOT / 2} y={CHART_HEIGHT + 18} textAnchor="middle" className="fill-gray-400" style={{ fontSize: 10 }}>
              {formatShortDate(d.date)}
            </text>
          ) : null
        )}
      </svg>

      {hover !== null && (
        <div
          className="absolute -translate-x-1/2 -translate-y-full bg-gray-900 text-white text-xs rounded-lg px-2.5 py-1.5 pointer-events-none whitespace-nowrap shadow-lg"
          style={{ left: hover * SLOT + SLOT / 2, top: CHART_HEIGHT - Math.max((data[hover].value / max) * (CHART_HEIGHT - 8), 2) - 8 }}
        >
          {formatShortDate(data[hover].date)} · ฿{data[hover].value.toLocaleString()}
        </div>
      )}
    </div>
  )
}
