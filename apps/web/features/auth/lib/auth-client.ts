import type { AuthUser, OnboardingData } from "@/features/auth/types"
import type { LoginInput, SignupInput } from "@/features/auth/lib/validation"

// Mock network layer — swap these for real API calls once the backend is ready.
const NETWORK_DELAY_MS = 700

function delay<T>(value: T, ms = NETWORK_DELAY_MS) {
  return new Promise<T>((resolve) => setTimeout(() => resolve(value), ms))
}

export class AuthError extends Error {}

export async function loginWithCredentials(input: LoginInput): Promise<AuthUser> {
  if (input.password.length < 8) {
    await delay(null, 400)
    throw new AuthError("Incorrect email or password.")
  }
  return delay({ id: "mock-user-id", name: "Alex Rivera", email: input.email })
}

export async function signupWithCredentials(input: SignupInput): Promise<AuthUser> {
  return delay({ id: "mock-user-id", name: input.name, email: input.email })
}

export async function continueWithGoogle(): Promise<AuthUser> {
  return delay({
    id: "mock-google-user-id",
    name: "Alex Rivera",
    email: "alex.rivera@gmail.com",
  })
}

export async function completeOnboarding(
  input: OnboardingData
): Promise<{ success: true; businessName: string }> {
  return delay({ success: true, businessName: input.businessName })
}
