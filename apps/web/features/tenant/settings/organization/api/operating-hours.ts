import { apiClient } from "@/api-client"
import type { OpeningHours } from "@repo/types"
import { isAxiosError } from "axios"

const base = (tenant: string) => `/api/v1/gyms/${tenant}/settings/operating-hours`

export async function getOperatingHours(tenant: string): Promise<OpeningHours> {
  try {
    const { data } = await apiClient.get<{ data: OpeningHours }>(base(tenant))
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(
        error.response?.data?.message ?? "Could not load operating hours."
      )
    }
    throw error
  }
}

export async function updateOperatingHours(
  tenant: string,
  hours: OpeningHours
): Promise<OpeningHours> {
  try {
    const { data } = await apiClient.patch<{ data: OpeningHours }>(
      base(tenant),
      hours
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(
        error.response?.data?.message ?? "Could not update operating hours."
      )
    }
    throw error
  }
}
