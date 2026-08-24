import { CheckCircle2 } from "lucide-react"

import { BUSINESS_TYPES } from "@/features/auth/lib/constants"

interface ClubTypeStepProps {
  value: string | null
  error?: string
  onChange: (id: string) => void
}

export function ClubTypeStep({ value, error, onChange }: ClubTypeStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Choose your business type
        </h1>
        <p className="text-sm text-muted-foreground">
          This helps us tailor Rackrage to how you operate.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {BUSINESS_TYPES.map((type) => {
          const Icon = type.icon
          const selected = value === type.id
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onChange(type.id)}
              aria-pressed={selected}
              className={`relative flex cursor-pointer flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors ${
                selected
                  ? "border-foreground bg-muted/60"
                  : "border-border hover:bg-muted/40"
              }`}
            >
              {selected && (
                <CheckCircle2 className="absolute top-3 right-3 size-4 text-primary" />
              )}
              <Icon className="size-5 text-foreground" />
              <span className="text-sm font-medium text-foreground">
                {type.title}
              </span>
              <span className="text-xs leading-relaxed text-muted-foreground">
                {type.description}
              </span>
            </button>
          )
        })}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
