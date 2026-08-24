import type { OnboardingInput } from "@repo/types"

import { authClient } from "@/auth-client"
import type { AuthUser } from "@/features/auth/types"
import type { LoginInput, SignupInput } from "@/features/auth/lib/validation"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export class AuthError extends Error {}

export async function loginWithCredentials(input: LoginInput): Promise<AuthUser> {
  const { data, error } = await authClient.signIn.email({
    email: input.email,
    password: input.password,
  })
  if (error) throw new AuthError(error.message ?? "Incorrect email or password.")
  return { id: data.user.id, name: data.user.name, email: data.user.email }
}

export async function signupWithCredentials(input: SignupInput): Promise<AuthUser> {
  const { data, error } = await authClient.signUp.email({
    email: input.email,
    password: input.password,
    name: input.name,
  })
  if (error) throw new AuthError(error.message ?? "Could not create account.")
  return { id: data.user.id, name: data.user.name, email: data.user.email }
}

export async function continueWithGoogle(callbackURL: string): Promise<void> {
  const { error } = await authClient.signIn.social({ provider: "google", callbackURL })
  if (error) throw new AuthError(error.message ?? "Could not sign in with Google.")
}

export async function completeOnboarding(input: OnboardingInput): Promise<{ id: string; slug: string }> {
  const res = await fetch(`${API_URL}/api/v1/gyms`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new AuthError(body?.message ?? "Could not complete onboarding.")
  }
  return res.json()
}
