"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { AuthHeader } from "@/features/auth/components/auth-header"
import { StepNav } from "@/features/auth/components/onboarding/step-nav"
import { ClubTypeStep } from "@/features/auth/components/onboarding/steps/club-type-step"
import { SpecialtiesStep } from "@/features/auth/components/onboarding/steps/specialties-step"
import { BusinessDetailsStep } from "@/features/auth/components/onboarding/steps/business-details-step"
import { ReviewStep } from "@/features/auth/components/onboarding/steps/review-step"
import { useOnboardingMutation } from "@/features/auth/hooks/use-onboarding-mutation"
import { businessDetailsSchema, fieldErrors } from "@/features/auth/lib/validation"
import { BUSINESS_TYPES } from "@/features/auth/lib/constants"
import type { OnboardingData } from "@/features/auth/types"

const STEP_COUNT = 4

const initialData: OnboardingData = {
  businessTypeId: null,
  specialties: [],
  businessName: "",
  address: "",
  phone: "",
  email: "",
  website: "",
}

export function OnboardingWizard() {
  const router = useRouter()
  const onboarding = useOnboardingMutation()

  const [step, setStep] = useState(0)
  const [data, setData] = useState<OnboardingData>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const selectedType = BUSINESS_TYPES.find((t) => t.id === data.businessTypeId)

  function updateData(patch: Partial<OnboardingData>) {
    setData((prev) => ({ ...prev, ...patch }))
  }

  function handleBack() {
    setErrors({})
    setStep((s) => Math.max(0, s - 1))
  }

  function handleContinue() {
    if (step === 0) {
      if (!data.businessTypeId) {
        setErrors({ businessType: "Choose a business type to continue" })
        return
      }
    } else if (step === 1) {
      if (data.specialties.length === 0) {
        setErrors({ specialties: "Pick at least one specialty" })
        return
      }
    } else if (step === 2) {
      const result = businessDetailsSchema.safeParse(data)
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

    onboarding.mutate(data, {
      onSuccess: () => router.push("/"),
    })
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-8 px-6 py-8 sm:px-12">
      <div className="w-full max-w-lg">
        <AuthHeader />
      </div>

      <div className="flex w-full flex-1 items-center justify-center">
        <div className="w-full max-w-lg">
          {step === 0 && (
            <ClubTypeStep
              value={data.businessTypeId}
              error={errors.businessType}
              onChange={(id) => updateData({ businessTypeId: id })}
            />
          )}
          {step === 1 && (
            <SpecialtiesStep
              businessTypeLabel={selectedType?.title}
              value={data.specialties}
              error={errors.specialties}
              onChange={(specialties) => updateData({ specialties })}
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
            <ReviewStep data={data} businessType={selectedType} />
          )}
        </div>
      </div>

      <div className="w-full max-w-lg">
        <StepNav
          step={step}
          totalSteps={STEP_COUNT}
          onBack={handleBack}
          onNext={handleContinue}
          nextLabel={step === STEP_COUNT - 1 ? "Start free trial" : "Continue"}
          isSubmitting={onboarding.isPending}
        />
      </div>
    </div>
  )
}
