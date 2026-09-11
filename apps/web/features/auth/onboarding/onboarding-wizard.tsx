"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { DEFAULT_OPENING_HOURS, onboardingSchema, type OnboardingInput } from "@repo/types"

import { AuthHeader } from "@/features/auth/components/auth-header"
import { StepNav } from "@/features/auth/onboarding/step-nav"
import { SportsStep } from "@/features/auth/onboarding/steps/sports-step"
import { FeaturesStep } from "@/features/auth/onboarding/steps/features-step"
import { BusinessDetailsStep } from "@/features/auth/onboarding/steps/business-details-step"
import { OpeningHoursStep } from "@/features/auth/onboarding/steps/opening-hours-step"
import { useOnboardingMutation } from "@/features/auth/onboarding/hooks/useOnboarding"
import { fieldErrors } from "@/features/auth/lib/validation"

const STEP_COUNT = 4

type WizardData = Omit<OnboardingInput, "specialties" | "features"> & {
  specialties: string[]
  features: string[]
}

const initialData: WizardData = {
  specialties: [],
  features: [],
  businessName: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  openingHours: DEFAULT_OPENING_HOURS,
}

export function OnboardingWizard() {
  const router = useRouter()
  const onboarding = useOnboardingMutation()

  const [step, setStep] = useState(0)
  const [data, setData] = useState<WizardData>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isRedirecting, setIsRedirecting] = useState(false)

  function updateData(patch: Partial<WizardData>) {
    setData((prev) => ({ ...prev, ...patch }))
  }

  function handleBack() {
    setErrors({})
    setStep((s) => Math.max(0, s - 1))
  }

  function handleContinue() {
    if (step === 0) {
      if (data.specialties.length === 0) {
        setErrors({ specialties: "Pick at least one specialty" })
        return
      }
    } else if (step === 1) {
      if (data.features.length === 0) {
        setErrors({ features: "Add at least one feature" })
        return
      }
    } else if (step === 2) {
      const result = onboardingSchema
        .pick({
          businessName: true,
          address: true,
          phone: true,
          email: true,
          website: true,
        })
        .safeParse({
          businessName: data.businessName,
          address: data.address,
          phone: data.phone,
          email: data.email,
          website: data.website,
        })
      if (!result.success) {
        setErrors(fieldErrors(result.error))
        return
      }
    } else if (step === 3) {
      const result = onboardingSchema.safeParse(data)
      if (!result.success) {
        setErrors(fieldErrors(result.error))
        return
      }
    }

    setErrors({})

    if (step < STEP_COUNT - 1) {
      setStep((s) => s + 1)
      return
    }

    setIsRedirecting(true)

    onboarding.mutate(
      {
        ...data,
        specialties: data.specialties as OnboardingInput["specialties"],
        features: data.features as OnboardingInput["features"],
      },
      {
        onSuccess: (result) => router.push(`/s/${result.id}/dashboard`),
        onError: (error) => {
          setIsRedirecting(false)
          toast.error(error.message)
        },
      }
    )
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-8 px-6 py-8 sm:px-12">
      <div className="w-full max-w-lg">
        <AuthHeader />
      </div>

      <div className="flex w-full flex-1 items-center justify-center">
        <div className="w-full max-w-lg">
          {step === 0 && (
            <SportsStep
              value={data.specialties}
              error={errors.specialties}
              onChange={(specialties) => updateData({ specialties })}
            />
          )}
          {step === 1 && (
            <FeaturesStep
              value={data.features}
              error={errors.features}
              onChange={(features) => updateData({ features })}
            />
          )}
          {step === 2 && (
            <BusinessDetailsStep
              value={data}
              errors={errors}
              onChange={updateData}
            />
          )}
          {step === 3 && (
            <OpeningHoursStep
              value={data.openingHours}
              onChange={(openingHours) => updateData({ openingHours })}
              isSubmitting={isRedirecting}
            />
          )}
        </div>
      </div>

      <div className="w-full max-w-lg">
        <StepNav
          step={step}
          totalSteps={STEP_COUNT}
          onBack={handleBack}
          onNext={handleContinue}
          nextLabel={step === STEP_COUNT - 1 ? "Create" : "Continue"}
          isSubmitting={onboarding.isPending || isRedirecting}
        />
      </div>
    </div>
  )
}
