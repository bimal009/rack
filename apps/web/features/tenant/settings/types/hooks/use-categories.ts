"use client"

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { NewProductCategory, ProductCategoryListQuery } from "@repo/types"

import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "../api/category"

export function useCategoriesQuery(
  tenant: string,
  query: Partial<ProductCategoryListQuery> = {}
) {
  return useQuery({
    queryKey: [...["settings", "categories", tenant], query],
    queryFn: () => listCategories(tenant, query),
    enabled: Boolean(tenant),
    placeholderData: keepPreviousData,
  })
}

export function useCreateCategory(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewProductCategory) => createCategory(tenant, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "categories", tenant],
      }),
  })
}

export function useUpdateCategory(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; input: Partial<NewProductCategory> }) =>
      updateCategory(tenant, vars.id, vars.input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "categories", tenant],
      }),
  })
}

export function useDeleteCategory(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCategory(tenant, id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "categories", tenant],
      }),
  })
}
