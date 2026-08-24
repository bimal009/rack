import { Check } from "lucide-react"

import { SPECIALTY_OPTIONS } from "@/features/auth/lib/constants"

interface SpecialtiesStepProps {
  businessTypeLabel?: string
  value: string[]
  error?: string
  onChange: (specialties: string[]) => void
}

export function SpecialtiesStep({
  businessTypeLabel,
  value,
  error,
  onChange,
}: SpecialtiesStepProps) {
  function toggle(specialty: string) {
    onChange(
      value.includes(specialty)
        ? value.filter((s) => s !== specialty)
        : [...value, specialty]
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {businessTypeLabel
            ? `Great. Let's set up your ${businessTypeLabel}`
            : "What do you offer?"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Pick everything that applies. You can adjust this anytime.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SPECIALTY_OPTIONS.map((specialty) => {
          const selected = value.includes(specialty)
          return (
            <button
              key={specialty}
              type="button"
              onClick={() => toggle(specialty)}
              aria-pressed={selected}
              className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
                selected
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground hover:bg-muted/50"
              }`}
            >
              {selected && <Check className="size-3.5" />}
              {specialty}
            </button>
          )
        })}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
