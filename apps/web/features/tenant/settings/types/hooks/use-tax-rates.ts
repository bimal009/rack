"use client"

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { NewTaxRate, TaxRateListQuery } from "@repo/types"

import {
  createTaxRate,
  deleteTaxRate,
  listTaxRates,
  updateTaxRate,
} from "../api/tax-rate"

export function useTaxRatesQuery(
  tenant: string,
  query: Partial<TaxRateListQuery> = {}
) {
  return useQuery({
    queryKey: [...["settings", "tax-rates", tenant], query],
    queryFn: () => listTaxRates(tenant, query),
    enabled: Boolean(tenant),
    placeholderData: keepPreviousData,
  })
}

export function useCreateTaxRate(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewTaxRate) => createTaxRate(tenant, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "tax-rates", tenant],
      }),
  })
}

export function useUpdateTaxRate(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; input: Partial<NewTaxRate> }) =>
      updateTaxRate(tenant, vars.id, vars.input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "tax-rates", tenant],
      }),
  })
}

export function useDeleteTaxRate(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteTaxRate(tenant, id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "tax-rates", tenant],
      }),
  })
}
