import { apiClient } from "@/api-client"
import type {
  NewTaxRate,
  TaxRate,
  TaxRateListQuery,
  TaxRateListResponse,
} from "@repo/types"
import { isAxiosError } from "axios"

const base = (tenant: string) => `/api/v1/gyms/${tenant}/settings/tax-rates`

export async function listTaxRates(
  tenant: string,
  query: Partial<TaxRateListQuery>
): Promise<TaxRateListResponse> {
  try {
    const { data } = await apiClient.get<TaxRateListResponse>(base(tenant), {
      params: query,
    })
    return { data: data.data, meta: data.meta }
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not load tax rates.")
    }
    throw error
  }
}

export async function createTaxRate(
  tenant: string,
  input: NewTaxRate
): Promise<TaxRate> {
  try {
    const { data } = await apiClient.post<{ data: TaxRate }>(base(tenant), input)
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not create tax rate.")
    }
    throw error
  }
}

export async function updateTaxRate(
  tenant: string,
  id: string,
  input: Partial<NewTaxRate>
): Promise<TaxRate> {
  try {
    const { data } = await apiClient.patch<{ data: TaxRate }>(
      `${base(tenant)}/${id}`,
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not update tax rate.")
    }
    throw error
  }
}

export async function deleteTaxRate(
  tenant: string,
  id: string
): Promise<TaxRate> {
  try {
    const { data } = await apiClient.delete<{ data: TaxRate }>(
      `${base(tenant)}/${id}`
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not delete tax rate.")
    }
    throw error
  }
}
