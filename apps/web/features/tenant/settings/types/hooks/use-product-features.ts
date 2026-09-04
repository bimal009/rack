"use client"

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { NewProductFeature, ProductFeatureListQuery } from "@repo/types"

import {
  createProductFeature,
  deleteProductFeature,
  listProductFeatures,
  updateProductFeature,
} from "../api/product-feature"

export function useProductFeaturesQuery(
  tenant: string,
  query: Partial<ProductFeatureListQuery> = {}
) {
  return useQuery({
    queryKey: ["settings", "product-features", tenant, query],
    queryFn: () => listProductFeatures(tenant, query),
    enabled: Boolean(tenant),
    placeholderData: keepPreviousData,
  })
}

export function useCreateProductFeature(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewProductFeature) => createProductFeature(tenant, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "product-features", tenant],
      }),
  })
}

export function useUpdateProductFeature(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; input: Partial<NewProductFeature> }) =>
      updateProductFeature(tenant, vars.id, vars.input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "product-features", tenant],
      }),
  })
}

export function useDeleteProductFeature(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProductFeature(tenant, id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "product-features", tenant],
      }),
  })
}
