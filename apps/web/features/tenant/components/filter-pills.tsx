"use client"

import { cn } from "@repo/ui/lib/utils"

interface FilterPillsProps<T extends string> {
  options: readonly T[]
  value: T
  onChange: (value: T) => void
}

export function FilterPills<T extends string>({
  options,
  value,
  onChange,
}: FilterPillsProps<T>) {
  return (
    <div className="no-scrollbar scroll-fade-x flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-full border border-border bg-card p-1">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
            value === option
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
