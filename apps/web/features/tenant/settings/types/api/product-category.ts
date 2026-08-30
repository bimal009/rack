import { apiClient } from "@/api-client"
import type {
  NewProductCategory,
  ProductCategory,
  ProductCategoryListQuery,
  ProductCategoryListResponse,
} from "@repo/types"
import { isAxiosError } from "axios"

const base = (tenant: string) =>
  `/api/v1/gyms/${tenant}/settings/product-categories`

export async function listProductCategories(
  tenant: string,
  query: Partial<ProductCategoryListQuery>
): Promise<ProductCategoryListResponse> {
  try {
    const { data } = await apiClient.get<ProductCategoryListResponse>(
      base(tenant),
      { params: query }
    )
    return { data: data.data, meta: data.meta }
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(
        error.response?.data?.message ?? "Could not load product categories."
      )
    }
    throw error
  }
}

export async function createProductCategory(
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
      throw new Error(
        error.response?.data?.message ?? "Could not create product category."
      )
    }
    throw error
  }
}

export async function updateProductCategory(
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
      throw new Error(
        error.response?.data?.message ?? "Could not update product category."
      )
    }
    throw error
  }
}

export async function deleteProductCategory(
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
      throw new Error(
        error.response?.data?.message ?? "Could not delete product category."
      )
    }
    throw error
  }
}
