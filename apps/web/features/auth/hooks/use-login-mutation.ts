"use client"

import { useMutation } from "@tanstack/react-query"

import { loginWithCredentials } from "@/features/auth/lib/auth-client"

export function useLoginMutation() {
  return useMutation({
    mutationFn: loginWithCredentials,
  })
}
