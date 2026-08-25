import { apiClient } from "@/api-client";
import { AuthError } from "@/features/auth/lib/auth-client";
import { OnboardingInput } from "@repo/types";
import { isAxiosError } from "axios";

export async function completeOnboarding(input: OnboardingInput): Promise<{ id: string; slug: string }> {
  try {
    const { data } = await apiClient.post<{ data: { id: string; slug: string } }>("/api/v1/gyms", input)
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new AuthError(error.response?.data?.message ?? "Could not complete onboarding.")
    }
    throw error
  }
}
