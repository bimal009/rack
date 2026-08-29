"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { NewProductCategory } from "@repo/types"

import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "../api/category"

export function useCategoriesQuery(tenant: string) {
  return useQuery({
    queryKey: ["settings", "categories", tenant],
    queryFn: () => listCategories(tenant),
    enabled: Boolean(tenant),
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
