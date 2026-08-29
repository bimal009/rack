import { apiClient } from "@/api-client"
import type { Brand, NewBrand } from "@repo/types"
import { isAxiosError } from "axios"

const base = (tenant: string) => `/api/v1/gyms/${tenant}/settings/brands`

export async function listBrands(tenant: string): Promise<Brand[]> {
  try {
    const { data } = await apiClient.get<{ data: Brand[] }>(base(tenant))
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not load brands.")
    }
    throw error
  }
}

export async function createBrand(
  tenant: string,
  input: NewBrand
): Promise<Brand> {
  try {
    const { data } = await apiClient.post<{ data: Brand }>(base(tenant), input)
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not create brand.")
    }
    throw error
  }
}

export async function updateBrand(
  tenant: string,
  id: string,
  input: Partial<NewBrand>
): Promise<Brand> {
  try {
    const { data } = await apiClient.patch<{ data: Brand }>(
      `${base(tenant)}/${id}`,
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not update brand.")
    }
    throw error
  }
}

export async function deleteBrand(tenant: string, id: string): Promise<Brand> {
  try {
    const { data } = await apiClient.delete<{ data: Brand }>(
      `${base(tenant)}/${id}`
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not delete brand.")
    }
    throw error
  }
}
