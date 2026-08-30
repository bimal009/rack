"use client"

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { NewPlanCategory, PlanCategoryListQuery } from "@repo/types"

import {
  createPlanCategory,
  deletePlanCategory,
  listPlanCategories,
  updatePlanCategory,
} from "../api/plan-category"

export function usePlanCategoriesQuery(
  tenant: string,
  query: Partial<PlanCategoryListQuery> = {}
) {
  return useQuery({
    queryKey: [...["settings", "plan-categories", tenant], query],
    queryFn: () => listPlanCategories(tenant, query),
    enabled: Boolean(tenant),
    placeholderData: keepPreviousData,
  })
}

export function useCreatePlanCategory(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewPlanCategory) => createPlanCategory(tenant, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "plan-categories", tenant],
      }),
  })
}

export function useUpdatePlanCategory(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; input: Partial<NewPlanCategory> }) =>
      updatePlanCategory(tenant, vars.id, vars.input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "plan-categories", tenant],
      }),
  })
}

export function useDeletePlanCategory(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deletePlanCategory(tenant, id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "plan-categories", tenant],
      }),
  })
}
