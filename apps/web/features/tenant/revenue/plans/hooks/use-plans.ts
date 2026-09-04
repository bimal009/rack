"use client"

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { GymPlanListQuery, NewGymPlan, UpdateGymPlan } from "@repo/types"

import {
  createGymPlan,
  deleteGymPlan,
  listGymPlans,
  updateGymPlan,
} from "../api/plan"

const gymPlansKey = (tenant: string) => ["gym-plans", tenant]

export function useGymPlansQuery(
  tenant: string,
  query: Partial<GymPlanListQuery> = {}
) {
  return useQuery({
    queryKey: [...gymPlansKey(tenant), query],
    queryFn: () => listGymPlans(tenant, query),
    enabled: Boolean(tenant),
    placeholderData: keepPreviousData,
  })
}

export function useCreateGymPlan(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewGymPlan) => createGymPlan(tenant, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: gymPlansKey(tenant) }),
  })
}

export function useUpdateGymPlan(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; input: UpdateGymPlan }) =>
      updateGymPlan(tenant, vars.id, vars.input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: gymPlansKey(tenant) }),
  })
}

export function useDeleteGymPlan(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteGymPlan(tenant, id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: gymPlansKey(tenant) }),
  })
}
