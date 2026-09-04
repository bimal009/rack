"use client"

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type {
  MembershipPlanListQuery,
  NewMembershipPlan,
  UpdateMembershipPlan,
} from "@repo/types"

import {
  createMembershipPlan,
  deleteMembershipPlan,
  listMembershipPlans,
  updateMembershipPlan,
} from "../api/membership"

const membershipsKey = (tenant: string) => ["memberships", tenant]

export function useMembershipPlansQuery(
  tenant: string,
  query: Partial<MembershipPlanListQuery> = {}
) {
  return useQuery({
    queryKey: [...membershipsKey(tenant), query],
    queryFn: () => listMembershipPlans(tenant, query),
    enabled: Boolean(tenant),
    placeholderData: keepPreviousData,
  })
}

export function useCreateMembershipPlan(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewMembershipPlan) => createMembershipPlan(tenant, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: membershipsKey(tenant) }),
  })
}

export function useUpdateMembershipPlan(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; input: UpdateMembershipPlan }) =>
      updateMembershipPlan(tenant, vars.id, vars.input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: membershipsKey(tenant) }),
  })
}

export function useDeleteMembershipPlan(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteMembershipPlan(tenant, id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: membershipsKey(tenant) }),
  })
}
