import { apiClient } from "@/api-client"
import type { NewProductCategory, ProductCategory } from "@repo/types"
import { isAxiosError } from "axios"

const base = (tenant: string) => `/api/v1/gyms/${tenant}/settings/categories`

export async function listCategories(
  tenant: string
): Promise<ProductCategory[]> {
  try {
    const { data } = await apiClient.get<{ data: ProductCategory[] }>(
      base(tenant)
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not load categories.")
    }
    throw error
  }
}

export async function createCategory(
  tenant: string,
  input: NewProductCategory
): Promise<ProductCategory> {
  try {
    const { data } = await apiClient.post<{ data: ProductCategory }>(
      base(tenant),
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not create category.")
    }
    throw error
  }
}

export async function updateCategory(
  tenant: string,
  id: string,
  input: Partial<NewProductCategory>
): Promise<ProductCategory> {
  try {
    const { data } = await apiClient.patch<{ data: ProductCategory }>(
      `${base(tenant)}/${id}`,
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not update category.")
    }
    throw error
  }
}

export async function deleteCategory(
  tenant: string,
  id: string
): Promise<ProductCategory> {
  try {
    const { data } = await apiClient.delete<{ data: ProductCategory }>(
      `${base(tenant)}/${id}`
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not delete category.")
    }
    throw error
  }
}
