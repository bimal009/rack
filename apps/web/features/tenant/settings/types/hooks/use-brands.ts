"use client"

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { NewBrand, BrandListQuery } from "@repo/types"

import { createBrand, deleteBrand, listBrands, updateBrand } from "../api/brand"

export function useBrandsQuery(
  tenant: string,
  query: Partial<BrandListQuery> = {}
) {
  return useQuery({
    queryKey: [...["settings", "brands", tenant], query],
    queryFn: () => listBrands(tenant, query),
    enabled: Boolean(tenant),
    placeholderData: keepPreviousData,
  })
}

export function useCreateBrand(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewBrand) => createBrand(tenant, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["settings", "brands", tenant] }),
  })
}

export function useUpdateBrand(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; input: Partial<NewBrand> }) =>
      updateBrand(tenant, vars.id, vars.input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["settings", "brands", tenant] }),
  })
}

export function useDeleteBrand(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteBrand(tenant, id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["settings", "brands", tenant] }),
  })
}
