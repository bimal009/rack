import { apiClient } from "@/api-client"
import type { GymRecord, UpdateGymInput } from "@repo/types"
import { isAxiosError } from "axios"

export class OrganizationError extends Error {}

export async function fetchMyGym(): Promise<GymRecord> {
  try {
    const { data } = await apiClient.get<{ data: GymRecord }>("/api/v1/gyms/me")
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new OrganizationError(
        error.response?.data?.message ?? "Could not load organization details."
      )
    }
    throw error
  }
}

export async function updateMyGym(input: UpdateGymInput): Promise<GymRecord> {
  try {
    const { data } = await apiClient.put<{ data: GymRecord }>(
      "/api/v1/gyms/me",
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new OrganizationError(
        error.response?.data?.message ?? "Could not update organization details."
      )
    }
    throw error
  }
}
