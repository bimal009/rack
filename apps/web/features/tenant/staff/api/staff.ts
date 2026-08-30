import { apiClient } from "@/api-client"
import type {
  CreateStaffResult,
  NewStaffWithUser,
  Staff,
  StaffListQuery,
  StaffListResponse,
  UpdateStaff,
} from "@repo/types"
import { isAxiosError } from "axios"

export class StaffError extends Error {}

const base = (tenant: string) => `/api/v1/gyms/${tenant}/staff`

export async function getStaffList(
  tenant: string,
  query: Partial<StaffListQuery>
): Promise<StaffListResponse> {
  try {
    const { data } = await apiClient.get<StaffListResponse>(
      `/api/v1/gyms/${tenant}/staff`,
      { params: query }
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
      base(tenant),
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

export async function updateStaff(
  tenant: string,
  id: string,
  input: UpdateStaff
): Promise<Staff> {
  try {
    const { data } = await apiClient.patch<{ data: Staff }>(
      `${base(tenant)}/${id}`,
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new StaffError(error.response?.data?.message ?? "Could not update staff.")
    }
    throw error
  }
}

export async function deleteStaff(
  tenant: string,
  id: string
): Promise<Staff> {
  try {
    const { data } = await apiClient.delete<{ data: Staff }>(
      `${base(tenant)}/${id}`
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new StaffError(error.response?.data?.message ?? "Could not delete staff.")
    }
    throw error
  }
}
