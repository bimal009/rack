"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { onboardingSchema, type OnboardingInput } from "@repo/types"

import { AuthHeader } from "@/features/auth/components/auth-header"
import { StepNav } from "@/features/auth/onboarding/step-nav"
import { ClubTypeStep } from "@/features/auth/onboarding/steps/club-type-step"
import { SpecialtiesStep } from "@/features/auth/onboarding/steps/specialties-step"
import { BusinessDetailsStep } from "@/features/auth/onboarding/steps/business-details-step"
import { useOnboardingMutation } from "@/features/auth/onboarding/hooks/useOnboarding"
import { fieldErrors } from "@/features/auth/lib/validation"
import { BUSINESS_TYPES } from "@/features/auth/lib/constants"

const STEP_COUNT = 3

type WizardData = Omit<OnboardingInput, "businessType" | "specialties"> & {
  businessType: OnboardingInput["businessType"] | null
  specialties: string[]
}

const initialData: WizardData = {
  businessType: null,
  specialties: [],
  slug: "",
  businessName: "",
  address: "",
  phone: "",
  email: "",
  website: "",
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function OnboardingWizard() {
  const router = useRouter()
  const onboarding = useOnboardingMutation()

  const [step, setStep] = useState(0)
  const [data, setData] = useState<WizardData>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const selectedType = BUSINESS_TYPES.find((t) => t.id === data.businessType)
  const slugTouched = useRef(false)

  function updateData(patch: Partial<WizardData>) {
    if ("slug" in patch) slugTouched.current = true

    setData((prev) => {
      const next = { ...prev, ...patch }
      if ("businessName" in patch && !slugTouched.current) {
        next.slug = slugify(next.businessName)
      }
      return next
    })
  }

  function handleBack() {
    setErrors({})
    setStep((s) => Math.max(0, s - 1))
  }

  function handleContinue() {
    if (step === 0) {
      if (!data.businessType) {
        setErrors({ businessType: "Choose a business type to continue" })
        return
      }
    } else if (step === 1) {
      if (data.specialties.length === 0) {
        setErrors({ specialties: "Pick at least one specialty" })
        return
      }
    } else if (step === 2) {
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

    onboarding.mutate(
      {
        ...data,
        businessType: data.businessType!,
        specialties: data.specialties as OnboardingInput["specialties"],
      },
      {
        onSuccess: () => router.push("/dashboard"),
        onError: (error) => toast.error(error.message),
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
            <ClubTypeStep
              value={data.businessType}
              error={errors.businessType}
              onChange={(id) => updateData({ businessType: id })}
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
              isSubmitting={onboarding.isPending}
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
          isSubmitting={onboarding.isPending}
        />
      </div>
    </div>
  )
}
