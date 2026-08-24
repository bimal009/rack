"use client"

import { useMutation } from "@tanstack/react-query"

import { completeOnboarding } from "@/features/auth/lib/auth-client"

export function useOnboardingMutation() {
  return useMutation({
    mutationFn: completeOnboarding,
  })
}
