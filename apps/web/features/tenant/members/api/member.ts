import { apiClient } from "@/api-client"
import type {
  CreateMemberResult,
  Member,
  MemberListQuery,
  MemberListResponse,
  NewMemberWithUser,
  UpdateMember,
} from "@repo/types"
import { isAxiosError } from "axios"

export class MemberError extends Error {}

const base = (tenant: string) => `/api/v1/gyms/${tenant}/members`

export async function getMemberList(
  tenant: string,
  query: Partial<MemberListQuery>
): Promise<MemberListResponse> {
  try {
    const { data } = await apiClient.get<MemberListResponse>(base(tenant), {
      params: query,
    })
    return { data: data.data, meta: data.meta }
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new MemberError(error.response?.data?.message ?? "Could not load members.")
    }
    throw error
  }
}

export async function createMember(
  tenant: string,
  input: NewMemberWithUser
): Promise<CreateMemberResult> {
  try {
    const { data } = await apiClient.post<{ data: CreateMemberResult }>(
      base(tenant),
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new MemberError(error.response?.data?.message ?? "Could not add member.")
    }
    throw error
  }
}

export async function updateMember(
  tenant: string,
  id: string,
  input: UpdateMember
): Promise<Member> {
  try {
    const { data } = await apiClient.patch<{ data: Member }>(
      `${base(tenant)}/${id}`,
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new MemberError(error.response?.data?.message ?? "Could not update member.")
    }
    throw error
  }
}

export async function deleteMember(tenant: string, id: string): Promise<Member> {
  try {
    const { data } = await apiClient.delete<{ data: Member }>(`${base(tenant)}/${id}`)
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new MemberError(error.response?.data?.message ?? "Could not remove member.")
    }
    throw error
  }
}
