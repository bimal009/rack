"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@repo/ui/components/ui/chart"

const data = [
  { day: "Mon", checkedIn: 62, missed: 8 },
  { day: "Tue", checkedIn: 78, missed: 6 },
  { day: "Wed", checkedIn: 71, missed: 10 },
  { day: "Thu", checkedIn: 90, missed: 5 },
  { day: "Fri", checkedIn: 84, missed: 9 },
  { day: "Sat", checkedIn: 102, missed: 4 },
  { day: "Sun", checkedIn: 58, missed: 3 },
]

const chartConfig = {
  checkedIn: {
    label: "Checked In",
    color: "var(--primary)",
  },
  missed: {
    label: "Missed Booking",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig

export function AttendanceChart() {
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

      <ChartContainer config={chartConfig} className="mt-4 aspect-auto h-64">
        <BarChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} width={28} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="checkedIn" fill="var(--color-checkedIn)" radius={4} />
          <Bar dataKey="missed" fill="var(--color-missed)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
