import { apiClient } from "@/api-client"
import type {
  ExtendGymMembership,
  GymMembership,
  GymMembershipListQuery,
  GymMembershipWithMemberAndPlan,
  NewGymMembership,
  PaginatedResponse,
  UpdateGymMembership,
} from "@repo/types"
import { isAxiosError } from "axios"

const listBase = (tenant: string) => `/api/v1/gyms/${tenant}/memberships`

const memberBase = (tenant: string, memberId: string) =>
  `/api/v1/gyms/${tenant}/members/${memberId}/memberships`

function handleError(error: unknown, fallback: string): never {
  if (isAxiosError<{ message?: string }>(error)) {
    throw new Error(error.response?.data?.message ?? fallback)
  }
  throw error as Error
}

export async function listMemberships(
  tenant: string,
  query: Partial<GymMembershipListQuery> = {}
): Promise<PaginatedResponse<GymMembershipWithMemberAndPlan>> {
  try {
    const { data } = await apiClient.get<PaginatedResponse<GymMembershipWithMemberAndPlan>>(
      listBase(tenant),
      { params: query }
    )
    return { data: data.data, meta: data.meta }
  } catch (error) {
    handleError(error, "Could not load memberships.")
  }
}

export async function getMembership(
  tenant: string,
  memberId: string
): Promise<GymMembershipWithMemberAndPlan | null> {
  try {
    const { data } = await apiClient.get<GymMembershipWithMemberAndPlan | null>(
      memberBase(tenant, memberId)
    )
    return data
  } catch (error) {
    handleError(error, "Could not load membership.")
  }
}

export async function createMembership(
  tenant: string,
  memberId: string,
  input: NewGymMembership
): Promise<GymMembership> {
  try {
    const { data } = await apiClient.post<GymMembership>(memberBase(tenant, memberId), input)
    return data
  } catch (error) {
    handleError(error, "Could not create membership.")
  }
}

export async function updateMembership(
  tenant: string,
  memberId: string,
  id: string,
  input: UpdateGymMembership
): Promise<GymMembership> {
  try {
    const { data } = await apiClient.patch<GymMembership>(
      `${memberBase(tenant, memberId)}/${id}`,
      input
    )
    return data
  } catch (error) {
    handleError(error, "Could not update membership.")
  }
}

export async function extendMembership(
  tenant: string,
  memberId: string,
  id: string,
  input: ExtendGymMembership
): Promise<GymMembership> {
  try {
    const { data } = await apiClient.post<GymMembership>(
      `${memberBase(tenant, memberId)}/${id}/extend`,
      input
    )
    return data
  } catch (error) {
    handleError(error, "Could not extend membership.")
  }
}