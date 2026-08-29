import { apiClient } from "@/api-client"
import type { ClassType, NewClassType } from "@repo/types"
import { isAxiosError } from "axios"

const base = (tenant: string) => `/api/v1/gyms/${tenant}/settings/class-types`

export async function listClassTypes(tenant: string): Promise<ClassType[]> {
  try {
    const { data } = await apiClient.get<{ data: ClassType[] }>(base(tenant))
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not load class types.")
    }
    throw error
  }
}

export async function createClassType(
  tenant: string,
  input: NewClassType
): Promise<ClassType> {
  try {
    const { data } = await apiClient.post<{ data: ClassType }>(base(tenant), input)
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not create class type.")
    }
    throw error
  }
}

export async function updateClassType(
  tenant: string,
  id: string,
  input: Partial<NewClassType>
): Promise<ClassType> {
  try {
    const { data } = await apiClient.patch<{ data: ClassType }>(
      `${base(tenant)}/${id}`,
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not update class type.")
    }
    throw error
  }
}

export async function deleteClassType(
  tenant: string,
  id: string
): Promise<ClassType> {
  try {
    const { data } = await apiClient.delete<{ data: ClassType }>(
      `${base(tenant)}/${id}`
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not delete class type.")
    }
    throw error
  }
}
