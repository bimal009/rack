import { apiClient } from "@/api-client"
import type {
  CreateStaffResult,
  NewStaffWithUser,
  StaffListQuery,
  StaffListResponse,
} from "@repo/types"
import { isAxiosError } from "axios"

export class StaffError extends Error {}

export async function getStaffList(
  tenant: string,
  params: StaffListQuery
): Promise<StaffListResponse> {
  try {
    const { data } = await apiClient.get<StaffListResponse>(
      `/api/v1/gyms/${tenant}/staff`,
      { params }
    )
    return { data: data.data, meta: data.meta }
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new StaffError(error.response?.data?.message ?? "Could not load staff.")
    }
    throw error
  }
}

export async function createStaff(
  tenant: string,
  input: NewStaffWithUser
): Promise<CreateStaffResult> {
  try {
    const { data } = await apiClient.post<{ data: CreateStaffResult }>(
      `/api/v1/gyms/${tenant}/staff`,
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new StaffError(error.response?.data?.message ?? "Could not create staff.")
    }
    throw error
  }
}
