"use client"

import { useState, type KeyboardEvent } from "react"
import { Check, X } from "lucide-react"
import { SPECIALTY_OPTIONS } from "@repo/types"

import { Input } from "@repo/ui/components/ui/input"
import { cn } from "@repo/ui/lib/utils"

interface SportsStepProps {
  businessTypeLabel?: string
  value: string[]
  error?: string
  onChange: (sports: string[]) => void
}

export function SportsStep({
  businessTypeLabel,
  value,
  error,
  onChange,
}: SportsStepProps) {
  const [draft, setDraft] = useState("")

  function add(sport: string) {
    const name = sport.trim()
    if (!name) return
    if (value.some((s) => s.toLowerCase() === name.toLowerCase())) return
    onChange([...value, name])
    setDraft("")
  }

  function remove(sport: string) {
    onChange(value.filter((s) => s !== sport))
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      add(draft)
    } else if (event.key === "Backspace" && !draft && value.length) {
      remove(value[value.length - 1]!)
    }
  }

  const suggestions = SPECIALTY_OPTIONS.filter(
    (option) => !value.some((s) => s.toLowerCase() === option.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {businessTypeLabel
            ? `Great. Let's set up your ${businessTypeLabel}`
            : "What sports do you offer?"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Type a sport and press Enter. Add your own or pick from common ones.
        </p>
      </div>

      <div className="space-y-3">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="e.g. Boxing, Yoga, CrossFit"
          aria-invalid={Boolean(error)}
        />

        {value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map((sport) => (
              <span
                key={sport}
                className="flex items-center gap-1.5 rounded-full border border-foreground bg-foreground px-3 py-1.5 text-sm font-medium text-background"
              >
                {sport}
                <button
                  type="button"
                  onClick={() => remove(sport)}
                  aria-label={`Remove ${sport}`}
                  className="-mr-1 rounded-full p-0.5 hover:bg-background/20"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => add(option)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
                )}
              >
                <Check className="size-3.5 opacity-40" />
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
