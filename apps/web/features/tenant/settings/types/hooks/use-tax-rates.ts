"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { NewTaxRate } from "@repo/types"

import {
  createTaxRate,
  deleteTaxRate,
  listTaxRates,
  updateTaxRate,
} from "../api/tax-rate"

export function useTaxRatesQuery(tenant: string) {
  return useQuery({
    queryKey: ["settings", "tax-rates", tenant],
    queryFn: () => listTaxRates(tenant),
    enabled: Boolean(tenant),
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
