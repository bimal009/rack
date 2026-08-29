import { apiClient } from "@/api-client"
import type { AreaType, NewAreaType } from "@repo/types"
import { isAxiosError } from "axios"

const base = (tenant: string) => `/api/v1/gyms/${tenant}/settings/area-types`

export async function listAreaTypes(tenant: string): Promise<AreaType[]> {
  try {
    const { data } = await apiClient.get<{ data: AreaType[] }>(base(tenant))
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not load area types.")
    }
    throw error
  }
}

export async function createAreaType(
  tenant: string,
  input: NewAreaType
): Promise<AreaType> {
  try {
    const { data } = await apiClient.post<{ data: AreaType }>(base(tenant), input)
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not create area type.")
    }
    throw error
  }
}

export async function updateAreaType(
  tenant: string,
  id: string,
  input: Partial<NewAreaType>
): Promise<AreaType> {
  try {
    const { data } = await apiClient.patch<{ data: AreaType }>(
      `${base(tenant)}/${id}`,
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not update area type.")
    }
    throw error
  }
}

export async function deleteAreaType(
  tenant: string,
  id: string
): Promise<AreaType> {
  try {
    const { data } = await apiClient.delete<{ data: AreaType }>(
      `${base(tenant)}/${id}`
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not delete area type.")
    }
    throw error
  }
}
