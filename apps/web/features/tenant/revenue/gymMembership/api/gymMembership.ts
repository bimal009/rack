import { apiClient } from "@/api-client"
import type {
  GymMembershipListQuery,
  GymMembershipWithMemberAndPlan,
} from "@repo/types"
import type { PaginatedResponse } from "@repo/types"
import { isAxiosError } from "axios"

const base = (tenant: string) => `/api/v1/gyms/${tenant}/memberships`

export async function getMembership(
  tenant: string,
  query: Partial<GymMembershipListQuery> = {}
): Promise<PaginatedResponse<GymMembershipWithMemberAndPlan>> {
  try {
    const { data } = await apiClient.get
      <PaginatedResponse<GymMembershipWithMemberAndPlan>
    >(base(tenant), { params: query })
    return { data: data.data, meta: data.meta }
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not load memberships.")
    }
    throw error
  }
}