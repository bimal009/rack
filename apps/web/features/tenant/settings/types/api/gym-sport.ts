import { apiClient } from "@/api-client"
import type { GymSport, NewGymSport } from "@repo/types"
import { isAxiosError } from "axios"

const base = (tenant: string) => `/api/v1/gyms/${tenant}/sports`

export async function listGymSports(tenant: string): Promise<GymSport[]> {
  try {
    const { data } = await apiClient.get<{ data: GymSport[] }>(base(tenant))
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not load sports.")
    }
    throw error
  }
}

export async function createGymSport(
  tenant: string,
  input: NewGymSport
): Promise<GymSport> {
  try {
    const { data } = await apiClient.post<{ data: GymSport }>(base(tenant), input)
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not add sport.")
    }
    throw error
  }
}

export async function updateGymSport(
  tenant: string,
  id: string,
  input: Partial<NewGymSport>
): Promise<GymSport> {
  try {
    const { data } = await apiClient.patch<{ data: GymSport }>(
      `${base(tenant)}/${id}`,
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not update sport.")
    }
    throw error
  }
}

export async function deleteGymSport(
  tenant: string,
  id: string
): Promise<GymSport> {
  try {
    const { data } = await apiClient.delete<{ data: GymSport }>(
      `${base(tenant)}/${id}`
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not remove sport.")
    }
    throw error
  }
}
