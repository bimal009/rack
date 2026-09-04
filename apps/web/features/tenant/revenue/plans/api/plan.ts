import { apiClient } from "@/api-client"
import type {
  GymPlan,
  GymPlanListQuery,
  GymPlanListResponse,
  NewGymPlan,
  UpdateGymPlan,
} from "@repo/types"
import { isAxiosError } from "axios"

const base = (tenant: string) => `/api/v1/gyms/${tenant}/plans`

export async function listGymPlans(
  tenant: string,
  query: Partial<GymPlanListQuery> = {}
): Promise<GymPlanListResponse> {
  try {
    const { data } = await apiClient.get<GymPlanListResponse>(base(tenant), {
      params: query,
    })
    return { data: data.data, meta: data.meta }
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not load plans.")
    }
    throw error
  }
}

export async function createGymPlan(
  tenant: string,
  input: NewGymPlan
): Promise<GymPlan> {
  try {
    const { data } = await apiClient.post<{ data: GymPlan }>(base(tenant), input)
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not create plan.")
    }
    throw error
  }
}

export async function updateGymPlan(
  tenant: string,
  id: string,
  input: UpdateGymPlan
): Promise<GymPlan> {
  try {
    const { data } = await apiClient.patch<{ data: GymPlan }>(
      `${base(tenant)}/${id}`,
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not update plan.")
    }
    throw error
  }
}

export async function deleteGymPlan(tenant: string, id: string): Promise<GymPlan> {
  try {
    const { data } = await apiClient.delete<{ data: GymPlan }>(
      `${base(tenant)}/${id}`
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not delete plan.")
    }
    throw error
  }
}
