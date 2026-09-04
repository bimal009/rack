import { apiClient } from "@/api-client"
import type {
  NewProductFeature,
  ProductFeature,
  ProductFeatureListQuery,
  ProductFeatureListResponse,
} from "@repo/types"
import { isAxiosError } from "axios"

const base = (tenant: string) => `/api/v1/gyms/${tenant}/settings/product-features`

export async function listProductFeatures(
  tenant: string,
  query: Partial<ProductFeatureListQuery> = {}
): Promise<ProductFeatureListResponse> {
  try {
    const { data } = await apiClient.get<ProductFeatureListResponse>(base(tenant), {
      params: query,
    })
    return { data: data.data, meta: data.meta }
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(
        error.response?.data?.message ?? "Could not load product features."
      )
    }
    throw error
  }
}

export async function createProductFeature(
  tenant: string,
  input: NewProductFeature
): Promise<ProductFeature> {
  try {
    const { data } = await apiClient.post<{ data: ProductFeature }>(
      base(tenant),
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(
        error.response?.data?.message ?? "Could not add product feature."
      )
    }
    throw error
  }
}

export async function updateProductFeature(
  tenant: string,
  id: string,
  input: Partial<NewProductFeature>
): Promise<ProductFeature> {
  try {
    const { data } = await apiClient.patch<{ data: ProductFeature }>(
      `${base(tenant)}/${id}`,
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(
        error.response?.data?.message ?? "Could not update product feature."
      )
    }
    throw error
  }
}

export async function deleteProductFeature(
  tenant: string,
  id: string
): Promise<ProductFeature> {
  try {
    const { data } = await apiClient.delete<{ data: ProductFeature }>(
      `${base(tenant)}/${id}`
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(
        error.response?.data?.message ?? "Could not remove product feature."
      )
    }
    throw error
  }
}
