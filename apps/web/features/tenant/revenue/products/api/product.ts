import { apiClient } from "@/api-client"
import type {
  NewProduct,
  Product,
  ProductListQuery,
  ProductListResponse,
  UpdateProduct,
} from "@repo/types"
import { isAxiosError } from "axios"

const base = (tenant: string) => `/api/v1/gyms/${tenant}/products`

export async function listProducts(
  tenant: string,
  query: Partial<ProductListQuery> = {}
): Promise<ProductListResponse> {
  try {
    const { data } = await apiClient.get<ProductListResponse>(base(tenant), {
      params: query,
    })
    return { data: data.data, meta: data.meta }
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not load products.")
    }
    throw error
  }
}

export async function createProduct(
  tenant: string,
  input: NewProduct
): Promise<Product> {
  try {
    const { data } = await apiClient.post<{ data: Product }>(base(tenant), input)
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not create product.")
    }
    throw error
  }
}

export async function updateProduct(
  tenant: string,
  id: string,
  input: UpdateProduct
): Promise<Product> {
  try {
    const { data } = await apiClient.patch<{ data: Product }>(
      `${base(tenant)}/${id}`,
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not update product.")
    }
    throw error
  }
}

export async function deleteProduct(tenant: string, id: string): Promise<Product> {
  try {
    const { data } = await apiClient.delete<{ data: Product }>(
      `${base(tenant)}/${id}`
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not delete product.")
    }
    throw error
  }
}
