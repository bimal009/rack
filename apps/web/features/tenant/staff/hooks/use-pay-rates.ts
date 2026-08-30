"use client"

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { NewPayRate, PayRateListQuery, UpdatePayRate } from "@repo/types"

import {
  createPayRate,
  deletePayRate,
  listPayRates,
  updatePayRate,
} from "../api/pay-rate"

export function usePayRatesQuery(
  tenant: string,
  query: Partial<PayRateListQuery> = {}
) {
  return useQuery({
    queryKey: ["staff", "pay-rates", tenant, query],
    queryFn: () => listPayRates(tenant, query),
    enabled: Boolean(tenant),
    placeholderData: keepPreviousData,
  })
}

export function useCreatePayRate(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewPayRate) => createPayRate(tenant, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["staff", "pay-rates", tenant],
      }),
  })
}

export function useUpdatePayRate(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; input: UpdatePayRate }) =>
      updatePayRate(tenant, vars.id, vars.input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["staff", "pay-rates", tenant],
      }),
  })
}

export function useDeletePayRate(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deletePayRate(tenant, id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["staff", "pay-rates", tenant],
      }),
  })
}
