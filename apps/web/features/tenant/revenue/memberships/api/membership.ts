import { apiClient } from "@/api-client"
import type {
  MembershipPlan,
  MembershipPlanListQuery,
  MembershipPlanListResponse,
  NewMembershipPlan,
  UpdateMembershipPlan,
} from "@repo/types"
import { isAxiosError } from "axios"

const base = (tenant: string) => `/api/v1/gyms/${tenant}/memberships`

export async function listMembershipPlans(
  tenant: string,
  query: Partial<MembershipPlanListQuery> = {}
): Promise<MembershipPlanListResponse> {
  try {
    const { data } = await apiClient.get<MembershipPlanListResponse>(base(tenant), {
      params: query,
    })
    return { data: data.data, meta: data.meta }
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not load memberships.")
    }
    throw error
  }
}

export async function createMembershipPlan(
  tenant: string,
  input: NewMembershipPlan
): Promise<MembershipPlan> {
  try {
    const { data } = await apiClient.post<{ data: MembershipPlan }>(
      base(tenant),
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not create membership.")
    }
    throw error
  }
}

export async function updateMembershipPlan(
  tenant: string,
  id: string,
  input: UpdateMembershipPlan
): Promise<MembershipPlan> {
  try {
    const { data } = await apiClient.patch<{ data: MembershipPlan }>(
      `${base(tenant)}/${id}`,
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not update membership.")
    }
    throw error
  }
}

export async function deleteMembershipPlan(
  tenant: string,
  id: string
): Promise<MembershipPlan> {
  try {
    const { data } = await apiClient.delete<{ data: MembershipPlan }>(
      `${base(tenant)}/${id}`
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not delete membership.")
    }
    throw error
  }
}
