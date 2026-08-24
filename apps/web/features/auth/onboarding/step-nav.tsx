import { ArrowRight } from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"
import { Spinner } from "@repo/ui/components/ui/spinner"

interface StepNavProps {
  step: number
  totalSteps: number
  onBack: () => void
  onNext: () => void
  nextLabel: string
  isSubmitting?: boolean
}

export function StepNav({
  step,
  totalSteps,
  onBack,
  onNext,
  nextLabel,
  isSubmitting,
}: StepNavProps) {
  return (
    <div className="flex items-center justify-between border-t border-border pt-6">
      {step > 0 ? (
        <Button type="button" variant="ghost" onClick={onBack}>
          Back
        </Button>
      ) : (
        <span />
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <span
              key={index}
              className={`h-1 rounded-full transition-all ${
                index === step
                  ? "w-6 bg-foreground"
                  : index < step
                    ? "w-3 bg-foreground/40"
                    : "w-3 bg-border"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {step + 1} of {totalSteps}
        </span>
      </div>

      <Button type="button" onClick={onNext} disabled={isSubmitting}>
        {isSubmitting && <Spinner />}
        {nextLabel}
        {!isSubmitting && <ArrowRight className="size-4" />}
      </Button>
    </div>
  )
}
