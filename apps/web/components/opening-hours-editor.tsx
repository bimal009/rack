"use client"

import { WEEKDAYS, type OpeningHours, type Weekday } from "@repo/types"

import { Switch } from "@repo/ui/components/ui/switch"

import { TimeSelect } from "@/components/time-select"

interface TimeRange {
  open: string
  close: string
}

interface DayScheduleEditorProps {
  day: Weekday
  range: TimeRange | null
  onChange: (range: TimeRange | null) => void
}

function DayScheduleEditor({ day, range, onChange }: DayScheduleEditorProps) {
  const closed = range === null

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-2.5 sm:w-36 sm:shrink-0">
        <Switch
          checked={!closed}
          onCheckedChange={(checked) =>
            onChange(checked ? { open: "09:00", close: "17:00" } : null)
          }
        />
        <span className="text-sm font-medium text-foreground">{day}</span>
      </div>

      {closed ? (
        <p className="text-sm text-muted-foreground">Closed</p>
      ) : (
        <div className="flex items-center gap-2">
          <TimeSelect
            value={range.open}
            onChange={(open) => onChange({ ...range, open })}
          />
          <span className="shrink-0 text-muted-foreground">–</span>
          <TimeSelect
            value={range.close}
            onChange={(close) => onChange({ ...range, close })}
          />
        </div>
      )}
    </div>
  )
}

interface OpeningHoursEditorProps {
  value: OpeningHours
  onChange: (value: OpeningHours) => void
}

export function OpeningHoursEditor({ value, onChange }: OpeningHoursEditorProps) {
  return (
    <div className="flex flex-col gap-3">
      {WEEKDAYS.map((day) => {
        const range = value.find((r) => r.day === day) ?? null

        return (
          <DayScheduleEditor
            key={day}
            day={day}
            range={range}
            onChange={(newRange) => {
              const otherDays = value.filter((r) => r.day !== day)
              onChange(newRange ? [...otherDays, { day, ...newRange }] : otherDays)
            }}
          />
        )
      })}
    </div>
  )
}
