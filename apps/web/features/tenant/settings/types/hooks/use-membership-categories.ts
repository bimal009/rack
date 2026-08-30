"use client"

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type {
  NewMembershipCategory,
  MembershipCategoryListQuery,
} from "@repo/types"

import {
  createMembershipCategory,
  deleteMembershipCategory,
  listMembershipCategories,
  updateMembershipCategory,
} from "../api/membership-category"

export function useMembershipCategoriesQuery(
  tenant: string,
  query: Partial<MembershipCategoryListQuery> = {}
) {
  return useQuery({
    queryKey: [...["settings", "membership-categories", tenant], query],
    queryFn: () => listMembershipCategories(tenant, query),
    enabled: Boolean(tenant),
    placeholderData: keepPreviousData,
  })
}

export function useCreateMembershipCategory(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewMembershipCategory) =>
      createMembershipCategory(tenant, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "membership-categories", tenant],
      }),
  })
}

export function useUpdateMembershipCategory(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; input: Partial<NewMembershipCategory> }) =>
      updateMembershipCategory(tenant, vars.id, vars.input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "membership-categories", tenant],
      }),
  })
}

export function useDeleteMembershipCategory(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteMembershipCategory(tenant, id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "membership-categories", tenant],
      }),
  })
}
