import type { OpeningHours } from "@repo/types"
import { Spinner } from "@repo/ui/components/ui/spinner"

import { OpeningHoursEditor } from "@/components/opening-hours-editor"

interface OpeningHoursStepProps {
  value: OpeningHours
  onChange: (value: OpeningHours) => void
  isSubmitting?: boolean
}

export function OpeningHoursStep({
  value,
  onChange,
  isSubmitting,
}: OpeningHoursStepProps) {
  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <Spinner className="size-6" />
        <div className="space-y-1.5">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Making your dashboard ready
          </h1>
          <p className="text-sm text-muted-foreground">
            Setting up your club, specialties, and workspace. This only takes a moment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          When are you open?
        </h1>
        <p className="text-sm text-muted-foreground">
          Set your weekly hours. Turn off a day if you&apos;re closed.
        </p>
      </div>

      <OpeningHoursEditor value={value} onChange={onChange} />
    </div>
  )
}
