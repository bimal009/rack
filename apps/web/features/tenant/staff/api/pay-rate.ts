import { apiClient } from "@/api-client"
import type {
  NewPayRate,
  PayRate,
  PayRateListQuery,
  PayRateListResponse,
  UpdatePayRate,
} from "@repo/types"
import { isAxiosError } from "axios"

const base = (tenant: string) => `/api/v1/gyms/${tenant}/pay-rates`

export async function listPayRates(
  tenant: string,
  query: Partial<PayRateListQuery>
): Promise<PayRateListResponse> {
  try {
    const { data } = await apiClient.get<PayRateListResponse>(base(tenant), {
      params: query,
    })
    return { data: data.data, meta: data.meta }
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not load pay rates.")
    }
    throw error
  }
}

export async function createPayRate(
  tenant: string,
  input: NewPayRate
): Promise<PayRate> {
  try {
    const { data } = await apiClient.post<{ data: PayRate }>(base(tenant), input)
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not create pay rate.")
    }
    throw error
  }
}

export async function updatePayRate(
  tenant: string,
  id: string,
  input: UpdatePayRate
): Promise<PayRate> {
  try {
    const { data } = await apiClient.patch<{ data: PayRate }>(
      `${base(tenant)}/${id}`,
      input
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not update pay rate.")
    }
    throw error
  }
}

export async function deletePayRate(
  tenant: string,
  id: string
): Promise<PayRate> {
  try {
    const { data } = await apiClient.delete<{ data: PayRate }>(
      `${base(tenant)}/${id}`
    )
    return data.data
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Could not delete pay rate.")
    }
    throw error
  }
}
