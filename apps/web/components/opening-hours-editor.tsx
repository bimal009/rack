"use client"

import { Plus, Trash2 } from "lucide-react"
import { WEEKDAYS, type DaySchedule, type OpeningHours, type Weekday } from "@repo/types"

import { Button } from "@repo/ui/components/ui/button"
import { Switch } from "@repo/ui/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select"

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2)
  const minutes = i % 2 === 0 ? "00" : "30"
  const value = `${String(hours).padStart(2, "0")}:${minutes}`
  const period = hours < 12 ? "AM" : "PM"
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  const label = `${hour12}:${minutes} ${period}`
  return { value, label }
})

function TimeSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v ?? "")}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {TIME_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

interface DayScheduleEditorProps {
  day: Weekday
  schedule: DaySchedule
  onChange: (schedule: DaySchedule) => void
}

export function DayScheduleEditor({
  day,
  schedule,
  onChange,
}: DayScheduleEditorProps) {
  function addRange() {
    onChange({
      ...schedule,
      ranges: [...schedule.ranges, { open: "09:00", close: "17:00" }],
    })
  }

  function updateRange(
    index: number,
    patch: Partial<{ open: string; close: string }>
  ) {
    onChange({
      ...schedule,
      ranges: schedule.ranges.map((range, i) =>
        i === index ? { ...range, ...patch } : range
      ),
    })
  }

  function removeRange(index: number) {
    onChange({
      ...schedule,
      ranges: schedule.ranges.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-start">
      <div className="flex items-center gap-2.5 sm:w-36 sm:shrink-0 sm:pt-1.5">
        <Switch
          checked={!schedule.closed}
          onCheckedChange={(checked) =>
            onChange({ ...schedule, closed: !checked })
          }
        />
        <span className="text-sm font-medium text-foreground">{day}</span>
      </div>

      {schedule.closed ? (
        <p className="text-sm text-muted-foreground sm:pt-1.5">Closed</p>
      ) : (
        <div className="flex flex-1 flex-col gap-2">
          {schedule.ranges.map((range, index) => (
            <div key={index} className="flex items-center gap-2">
              <TimeSelect
                value={range.open}
                onChange={(open) => updateRange(index, { open })}
              />
              <span className="shrink-0 text-muted-foreground">–</span>
              <TimeSelect
                value={range.close}
                onChange={(close) => updateRange(index, { close })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => removeRange(index)}
              >
                <Trash2 className="size-4" />
                <span className="sr-only">Remove time range</span>
              </Button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRange}
            className="flex w-fit items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <Plus className="size-3.5" />
            Add time range
          </button>
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
      {WEEKDAYS.map((day) => (
        <DayScheduleEditor
          key={day}
          day={day}
          schedule={value[day]}
          onChange={(schedule) =>
            onChange({ ...value, [day]: schedule })
          }
        />
      ))}
    </div>
  )
}
