"use client"

import { useMutation } from "@tanstack/react-query"

import { continueWithGoogle } from "@/features/auth/lib/auth-client"

export function useGoogleAuthMutation() {
  return useMutation({
    mutationFn: continueWithGoogle,
  })
}
