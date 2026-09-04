"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select"

export function formatTime12h(value: string): string {
  const [hoursStr, minutes = "00"] = value.split(":")
  const hours = Number(hoursStr)
  if (Number.isNaN(hours)) return value

  const period = hours < 12 ? "AM" : "PM"
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  return `${hour12}:${minutes} ${period}`
}

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2)
  const minutes = i % 2 === 0 ? "00" : "30"
  const value = `${String(hours).padStart(2, "0")}:${minutes}`
  return { value, label: formatTime12h(value) }
})

interface TimeSelectProps {
  value: string
  onChange: (value: string) => void
  id?: string
}

export function TimeSelect({ value, onChange, id }: TimeSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v ?? "")}>
      <SelectTrigger id={id} className="w-full">
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
