"use client"

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { NewProductCategory, ProductCategoryListQuery } from "@repo/types"

import {
  createProductCategory,
  deleteProductCategory,
  listProductCategories,
  updateProductCategory,
} from "../api/product-category"

export function useProductCategoriesQuery(
  tenant: string,
  query: Partial<ProductCategoryListQuery> = {}
) {
  return useQuery({
    queryKey: [...["settings", "product-categories", tenant], query],
    queryFn: () => listProductCategories(tenant, query),
    enabled: Boolean(tenant),
    placeholderData: keepPreviousData,
  })
}

export function useCreateProductCategory(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewProductCategory) =>
      createProductCategory(tenant, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "product-categories", tenant],
      }),
  })
}

export function useUpdateProductCategory(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; input: Partial<NewProductCategory> }) =>
      updateProductCategory(tenant, vars.id, vars.input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "product-categories", tenant],
      }),
  })
}

export function useDeleteProductCategory(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProductCategory(tenant, id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "product-categories", tenant],
      }),
  })
}
