import { apiClient } from "@/api-client"
import type {
  NewMembershipCategory,
  MembershipCategory,
  MembershipCategoryListQuery,
  MembershipCategoryListResponse,
} from "@repo/types"
import { isAxiosError } from "axios"

const base = (tenant: string) =>
  `/api/v1/gyms/${tenant}/settings/membership-categories`

export async function listMembershipCategories(
  tenant: string,
  query: Partial<MembershipCategoryListQuery>
): Promise<MembershipCategoryListResponse> {
  try {
    const { data } = await apiClient.get<MembershipCategoryListResponse>(
      base(tenant),
      { params: query }
    )
    return { data: data.data, meta: data.meta }
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(
        error.response?.data?.message ?? "Could not load membership categories."
      )
    }
    throw error
  }
}

export async function createMembershipCategory(
  tenant: string,
  input: NewMembershipCategory
): Promise<MembershipCategory> {
  try {
    const { data } = await apiClient.post<{ data: MembershipCategory }>(
      base(tenant),
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(
        error.response?.data?.message ?? "Could not create membership category."
      )
    }
    throw error
  }
}

export async function updateMembershipCategory(
  tenant: string,
  id: string,
  input: Partial<NewMembershipCategory>
): Promise<MembershipCategory> {
  try {
    const { data } = await apiClient.patch<{ data: MembershipCategory }>(
      `${base(tenant)}/${id}`,
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(
        error.response?.data?.message ?? "Could not update membership category."
      )
    }
    throw error
  }
}

export async function deleteMembershipCategory(
  tenant: string,
  id: string
): Promise<MembershipCategory> {
  try {
    const { data } = await apiClient.delete<{ data: MembershipCategory }>(
      `${base(tenant)}/${id}`
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(
        error.response?.data?.message ?? "Could not delete membership category."
      )
    }
    throw error
  }
}
