import { apiClient } from "@/api-client"
import type {
  NewPlanCategory,
  PlanCategory,
  PlanCategoryListQuery,
  PlanCategoryListResponse,
} from "@repo/types"
import { isAxiosError } from "axios"

const base = (tenant: string) =>
  `/api/v1/gyms/${tenant}/settings/plan-categories`

export async function listPlanCategories(
  tenant: string,
  query: Partial<PlanCategoryListQuery>
): Promise<PlanCategoryListResponse> {
  try {
    const { data } = await apiClient.get<PlanCategoryListResponse>(base(tenant), {
      params: query,
    })
    return { data: data.data, meta: data.meta }
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(
        error.response?.data?.message ?? "Could not load plan categories."
      )
    }
    throw error
  }
}

export async function createPlanCategory(
  tenant: string,
  input: NewPlanCategory
): Promise<PlanCategory> {
  try {
    const { data } = await apiClient.post<{ data: PlanCategory }>(
      base(tenant),
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(
        error.response?.data?.message ?? "Could not create plan category."
      )
    }
    throw error
  }
}

export async function updatePlanCategory(
  tenant: string,
  id: string,
  input: Partial<NewPlanCategory>
): Promise<PlanCategory> {
  try {
    const { data } = await apiClient.patch<{ data: PlanCategory }>(
      `${base(tenant)}/${id}`,
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(
        error.response?.data?.message ?? "Could not update plan category."
      )
    }
    throw error
  }
}

export async function deletePlanCategory(
  tenant: string,
  id: string
): Promise<PlanCategory> {
  try {
    const { data } = await apiClient.delete<{ data: PlanCategory }>(
      `${base(tenant)}/${id}`
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(
        error.response?.data?.message ?? "Could not delete plan category."
      )
    }
    throw error
  }
}
