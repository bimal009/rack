import { apiClient } from "@/api-client"
import type {
  InstructorTypeListQuery,
  InstructorTypeListResponse,
  InstructorTypeRecord,
  NewInstructorType,
} from "@repo/types"
import { isAxiosError } from "axios"

const base = (tenant: string) =>
  `/api/v1/gyms/${tenant}/settings/instructor-types`

export async function listInstructorTypes(
  tenant: string,
  query: Partial<InstructorTypeListQuery>
): Promise<InstructorTypeListResponse> {
  try {
    const { data } = await apiClient.get<InstructorTypeListResponse>(
      base(tenant),
      { params: query }
    )
    return { data: data.data, meta: data.meta }
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(
        error.response?.data?.message ?? "Could not load instructor types."
      )
    }
    throw error
  }
}

export async function createInstructorType(
  tenant: string,
  input: NewInstructorType
): Promise<InstructorTypeRecord> {
  try {
    const { data } = await apiClient.post<{ data: InstructorTypeRecord }>(
      base(tenant),
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(
        error.response?.data?.message ?? "Could not create instructor type."
      )
    }
    throw error
  }
}

export async function updateInstructorType(
  tenant: string,
  id: string,
  input: Partial<NewInstructorType>
): Promise<InstructorTypeRecord> {
  try {
    const { data } = await apiClient.patch<{ data: InstructorTypeRecord }>(
      `${base(tenant)}/${id}`,
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(
        error.response?.data?.message ?? "Could not update instructor type."
      )
    }
    throw error
  }
}

export async function deleteInstructorType(
  tenant: string,
  id: string
): Promise<InstructorTypeRecord> {
  try {
    const { data } = await apiClient.delete<{ data: InstructorTypeRecord }>(
      `${base(tenant)}/${id}`
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(
        error.response?.data?.message ?? "Could not delete instructor type."
      )
    }
    throw error
  }
}
