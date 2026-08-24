import { authClient } from "@/auth-client"
import type { AuthUser, OnboardingData } from "@/features/auth/types"
import type { LoginInput, SignupInput } from "@/features/auth/lib/validation"

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

// Not backed by better-auth — no onboarding endpoint on the backend yet.
const NETWORK_DELAY_MS = 700
function delay<T>(value: T, ms = NETWORK_DELAY_MS) {
  return new Promise<T>((resolve) => setTimeout(() => resolve(value), ms))
}

export async function completeOnboarding(
  input: OnboardingData
): Promise<{ success: true; businessName: string }> {
  return delay({ success: true, businessName: input.businessName })
}
