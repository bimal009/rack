"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { completeOnboarding } from "@/features/auth/onboarding/api/onboarding"

export function useOnboardingMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gym"] })
    },
  })
}
