import { apiClient } from "@/api-client"
import type {
  GymFeature,
  GymFeatureListQuery,
  GymFeatureListResponse,
  NewGymFeature,
} from "@repo/types"
import { isAxiosError } from "axios"

const base = (tenant: string) => `/api/v1/gyms/${tenant}/features`

export async function listGymFeatures(
  tenant: string,
  query: Partial<GymFeatureListQuery> = {}
): Promise<GymFeatureListResponse> {
  try {
    const { data } = await apiClient.get<GymFeatureListResponse>(base(tenant), {
      params: query,
    })
    return { data: data.data, meta: data.meta }
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not load features.")
    }
    throw error
  }
}

export async function createGymFeature(
  tenant: string,
  input: NewGymFeature
): Promise<GymFeature> {
  try {
    const { data } = await apiClient.post<{ data: GymFeature }>(base(tenant), input)
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not add feature.")
    }
    throw error
  }
}

export async function updateGymFeature(
  tenant: string,
  id: string,
  input: Partial<NewGymFeature>
): Promise<GymFeature> {
  try {
    const { data } = await apiClient.patch<{ data: GymFeature }>(
      `${base(tenant)}/${id}`,
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not update feature.")
    }
    throw error
  }
}

export async function deleteGymFeature(
  tenant: string,
  id: string
): Promise<GymFeature> {
  try {
    const { data } = await apiClient.delete<{ data: GymFeature }>(
      `${base(tenant)}/${id}`
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not remove feature.")
    }
    throw error
  }
}
