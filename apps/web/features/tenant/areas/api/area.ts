import { apiClient } from "@/api-client"
import type {
  Area,
  AreaListQuery,
  AreaListResponse,
  NewArea,
  UpdateArea,
} from "@repo/types"
import { isAxiosError } from "axios"

const base = (tenant: string) => `/api/v1/gyms/${tenant}/areas`

export async function listAreas(
  tenant: string,
  query: Partial<AreaListQuery>
): Promise<AreaListResponse> {
  try {
    const { data } = await apiClient.get<AreaListResponse>(base(tenant), {
      params: query,
    })
    return { data: data.data, meta: data.meta }
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not load areas.")
    }
    throw error
  }
}

export async function createArea(tenant: string, input: NewArea): Promise<Area> {
  try {
    const { data } = await apiClient.post<{ data: Area }>(base(tenant), input)
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not create area.")
    }
    throw error
  }
}

export async function updateArea(
  tenant: string,
  id: string,
  input: UpdateArea
): Promise<Area> {
  try {
    const { data } = await apiClient.patch<{ data: Area }>(
      `${base(tenant)}/${id}`,
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not update area.")
    }
    throw error
  }
}

export async function deleteArea(tenant: string, id: string): Promise<Area> {
  try {
    const { data } = await apiClient.delete<{ data: Area }>(
      `${base(tenant)}/${id}`
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not delete area.")
    }
    throw error
  }
}
