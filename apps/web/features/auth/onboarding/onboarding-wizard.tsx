"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { DEFAULT_OPENING_HOURS, onboardingSchema, type OnboardingInput } from "@repo/types"

import { AuthHeader } from "@/features/auth/components/auth-header"
import { StepNav } from "@/features/auth/onboarding/step-nav"
import { SportsStep } from "@/features/auth/onboarding/steps/sports-step"
import { FeaturesStep } from "@/features/auth/onboarding/steps/features-step"
import { BusinessDetailsStep } from "@/features/auth/onboarding/steps/business-details-step"
import { OpeningHoursStep } from "@/features/auth/onboarding/steps/opening-hours-step"
import { useOnboardingMutation } from "@/features/auth/onboarding/hooks/useOnboarding"

const STEP_COUNT = 4

const initialData: OnboardingInput = {
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
  const [isRedirecting, setIsRedirecting] = useState(false)
  const form = useForm<OnboardingInput>({
    defaultValues: initialData,
    resolver: zodResolver(onboardingSchema),
  })
  const { control, formState: { errors }, handleSubmit, setValue, trigger } = form
  const specialties = useWatch({ control, name: "specialties" }) ?? []
  const features = useWatch({ control, name: "features" }) ?? []
  const watchedBusinessDetails = useWatch({ control })
  const businessDetails = {
    businessName: watchedBusinessDetails.businessName ?? "",
    address: watchedBusinessDetails.address ?? "",
    phone: watchedBusinessDetails.phone ?? "",
    email: watchedBusinessDetails.email ?? "",
    website: watchedBusinessDetails.website ?? "",
  }
  const openingHours = useWatch({ control, name: "openingHours" }) ?? DEFAULT_OPENING_HOURS

  function handleBack() {
    setStep((s) => Math.max(0, s - 1))
  }

  async function handleContinue() {
    const valid = step === 0
      ? await trigger("specialties")
      : step === 1
        ? await trigger("features")
        : step === 2
          ? await trigger(["businessName", "address", "phone", "email", "website"])
          : await trigger("openingHours")
    if (!valid) return
    if (step < STEP_COUNT - 1) {
      setStep((s) => s + 1)
      return
    }
    const submit = handleSubmit((data) => {
      setIsRedirecting(true)
      onboarding.mutate(data, {
        onSuccess: (result) => router.push(`/gyms/${result.id}`),
        onError: (error) => {
          setIsRedirecting(false)
          toast.error(error.message)
        },
      })
    })
    void submit()
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
              value={specialties}
              error={errors.specialties?.message}
              onChange={(value) => setValue("specialties", value, { shouldValidate: true })}
            />
          )}
          {step === 1 && (
            <FeaturesStep
              value={features}
              error={errors.features?.message}
              onChange={(value) => setValue("features", value, { shouldValidate: true })}
            />
          )}
          {step === 2 && (
            <BusinessDetailsStep
              value={businessDetails}
              errors={{
                businessName: errors.businessName?.message ?? "",
                address: errors.address?.message ?? "",
                phone: errors.phone?.message ?? "",
                email: errors.email?.message ?? "",
                website: errors.website?.message ?? "",
              }}
              onChange={(patch) => {
                if (patch.businessName !== undefined) setValue("businessName", patch.businessName, { shouldValidate: true })
                if (patch.address !== undefined) setValue("address", patch.address, { shouldValidate: true })
                if (patch.phone !== undefined) setValue("phone", patch.phone, { shouldValidate: true })
                if (patch.email !== undefined) setValue("email", patch.email, { shouldValidate: true })
                if (patch.website !== undefined) setValue("website", patch.website, { shouldValidate: true })
              }}
            />
          )}
          {step === 3 && (
            <OpeningHoursStep
              value={openingHours}
              onChange={(value) => setValue("openingHours", value, { shouldValidate: true })}
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
