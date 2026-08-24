"use client"

import { useMutation } from "@tanstack/react-query"

import { signupWithCredentials } from "@/features/auth/lib/auth-client"

export function useSignupMutation() {
  return useMutation({
    mutationFn: signupWithCredentials,
  })
}
