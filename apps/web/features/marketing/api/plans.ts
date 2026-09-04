import { apiClient } from "@/api-client"
import type { Plan } from "@repo/types"
import { isAxiosError } from "axios"


export async function listPublicPlans(): Promise<Plan[]> {
  try {
    const { data } = await apiClient.get<{ data: Plan[] }>("/api/v1/plans")
    return data.data ?? []
  } catch (error) {
    if (isAxiosError(error)) return []
    throw error
  }
}
