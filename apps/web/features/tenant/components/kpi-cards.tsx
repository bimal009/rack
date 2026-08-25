import type { LucideIcon } from "lucide-react"
import {
  ArrowUpRight,
  CalendarClock,
  DoorOpen,
  UserPlus,
  Users,
} from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"
import { cn } from "@repo/ui/lib/utils"

type Kpi = {
  label: string
  icon: LucideIcon
  value: string
  trend: string
  trendTone: "up" | "warn"
  footnote: string
  visual: "spark" | "bars" | "stripes" | "single"
}

const kpis: Kpi[] = [
  {
    label: "Total Members",
    icon: Users,
    value: "248",
    trend: "+8%",
    trendTone: "up",
    footnote: "Member count grew over the last 30 days, from 230 to 248",
    visual: "spark",
  },
  {
    label: "Today's Check-ins",
    icon: DoorOpen,
    value: "86",
    trend: "+15%",
    trendTone: "up",
    footnote: "34% of members have checked in today (86 of 248)",
    visual: "bars",
  },
  {
    label: "Memberships Ending",
    icon: CalendarClock,
    value: "12",
    trend: "This week",
    trendTone: "warn",
    footnote: "12 memberships expire in the next 7 days",
    visual: "stripes",
  },
  {
    label: "New Members",
    icon: UserPlus,
    value: "19",
    trend: "+22%",
    trendTone: "up",
    footnote: "19 new sign-ups this month",
    visual: "single",
  },
]

function Sparkline() {
  return (
    <svg viewBox="0 0 100 28" className="h-7 w-full text-primary">
      <polyline
        points="0,24 15,20 30,22 45,14 60,16 75,6 100,2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MiniBars({ pattern }: { pattern: number[] }) {
  return (
    <div className="flex h-7 items-end gap-1">
      {pattern.map((h, i) => (
        <span
          key={i}
          className="w-1.5 rounded-full bg-primary"
          style={{ height: `${h}%`, opacity: 0.4 + (h / 100) * 0.6 }}
        />
      ))}
    </div>
  )
}

function Stripes() {
  return (
    <div className="flex h-7 items-end gap-1">
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "w-1.5 rounded-full",
            i % 2 === 0 ? "h-full bg-destructive/70" : "h-2/3 bg-muted"
          )}
        />
      ))}
    </div>
  )
}

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="flex flex-col rounded-xl border border-border bg-card p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <kpi.icon className="size-4" />
              {kpi.label}
            </div>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              See Details
            </Button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-2xl font-semibold text-foreground">
              {kpi.value}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
                kpi.trendTone === "up"
                  ? "bg-primary/10 text-primary"
                  : "bg-destructive/10 text-destructive"
              )}
            >
              {kpi.trendTone === "up" && <ArrowUpRight className="size-3" />}
              {kpi.trend}
            </span>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            {kpi.footnote}
          </p>

          <div className="mt-3">
            {kpi.visual === "spark" && <Sparkline />}
            {kpi.visual === "bars" && (
              <MiniBars pattern={[30, 55, 40, 70, 50, 85, 60]} />
            )}
            {kpi.visual === "stripes" && <Stripes />}
            {kpi.visual === "single" && (
              <MiniBars pattern={[20, 25, 30, 35, 45, 60, 90]} />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
