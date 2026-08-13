'use client'

import { useState } from 'react'

const SLOT = 28
const BAR_GAP = 6
const SEGMENT_GAP = 2
const CHART_HEIGHT = 160

const COMPLETED_COLOR = '#3e82bd' // blue-700
const CANCELLED_COLOR = '#fb7185' // rose-400

function formatShortDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
}

export function VisitsStatusChart({
  data,
}: {
  data: { date: string; completed: number; cancelled: number }[]
}) {
  const [hover, setHover] = useState<number | null>(null)
  const max = Math.max(...data.map((d) => d.completed + d.cancelled), 1)
  const labelStep = Math.max(1, Math.ceil(data.length / 10))
  const scale = (CHART_HEIGHT - 8) / max

  return (
    <div>
      <div className="flex items-center gap-4 mb-3 text-xs">
        <span className="flex items-center gap-1.5 text-gray-600">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COMPLETED_COLOR }} />
          เสร็จสิ้น
        </span>
        <span className="flex items-center gap-1.5 text-gray-600">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CANCELLED_COLOR }} />
          ยกเลิก
        </span>
      </div>

      <div className="relative overflow-x-auto">
        <svg width={data.length * SLOT} height={CHART_HEIGHT + 28} role="img" aria-label="กราฟจำนวนคิวเสร็จสิ้นและยกเลิกตามวัน">
          {[0, 0.5, 1].map((f) => (
            <line key={f} x1={0} x2={data.length * SLOT} y1={CHART_HEIGHT * (1 - f)} y2={CHART_HEIGHT * (1 - f)} stroke="#f1f5f9" strokeWidth={1} />
          ))}
          {data.map((d, i) => {
            const completedHeight = d.completed * scale
            const cancelledHeight = d.cancelled > 0 ? Math.max(d.cancelled * scale - SEGMENT_GAP, 2) : 0
            const x = i * SLOT + BAR_GAP / 2
            const width = SLOT - BAR_GAP
            const isDim = hover !== null && hover !== i
            return (
              <g key={d.date} opacity={isDim ? 0.45 : 1} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="cursor-pointer">
                <rect x={x} y={CHART_HEIGHT - completedHeight} width={width} height={Math.max(completedHeight, 1)} rx={2} fill={COMPLETED_COLOR} />
                {d.cancelled > 0 && (
                  <rect x={x} y={CHART_HEIGHT - completedHeight - SEGMENT_GAP - cancelledHeight} width={width} height={cancelledHeight} rx={2} fill={CANCELLED_COLOR} />
                )}
              </g>
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
            style={{ left: hover * SLOT + SLOT / 2, top: CHART_HEIGHT - (data[hover].completed + data[hover].cancelled) * scale - 10 }}
          >
            {formatShortDate(data[hover].date)} · เสร็จสิ้น {data[hover].completed} · ยกเลิก {data[hover].cancelled}
          </div>
        )}
      </div>
    </div>
  )
}
