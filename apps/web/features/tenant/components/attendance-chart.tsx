"use client"

import { useEffect, useRef, useState } from "react"
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { day: "Mon", checkedIn: 62, missed: 8 },
  { day: "Tue", checkedIn: 78, missed: 6 },
  { day: "Wed", checkedIn: 71, missed: 10 },
  { day: "Thu", checkedIn: 90, missed: 5 },
  { day: "Fri", checkedIn: 84, missed: 9 },
  { day: "Sat", checkedIn: 102, missed: 4 },
  { day: "Sun", checkedIn: 58, missed: 3 },
]

const CHART_HEIGHT = 256

function AttendanceTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name?: string; value?: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <p className="font-medium text-foreground">{label}</p>
      {payload.map((item) => (
        <p key={item.name} className="text-muted-foreground">
          {item.name}: <span className="font-medium text-foreground">{item.value}</span>
        </p>
      ))}
    </div>
  )
}

export function AttendanceChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) setWidth(entry.contentRect.width)
    })
    observer.observe(node)
    setWidth(node.getBoundingClientRect().width)

    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground">
          Weekly Attendance
        </h2>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary" />
            Checked In
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-muted-foreground" />
            Missed Booking
          </span>
          <span className="rounded-full border border-border px-2.5 py-1 font-medium">
            This Week
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="mt-4"
        style={{ height: CHART_HEIGHT }}
      >
        {width > 0 && (
          <BarChart width={width} height={CHART_HEIGHT} data={data}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="var(--border)"
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={28}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <Tooltip
              content={<AttendanceTooltip />}
              cursor={{ fill: "var(--muted)" }}
            />
            <Bar dataKey="checkedIn" name="Checked In" fill="var(--primary)" radius={4} />
            <Bar
              dataKey="missed"
              name="Missed Booking"
              fill="var(--muted-foreground)"
              radius={4}
            />
          </BarChart>
        )}
      </div>
    </div>
  )
}
