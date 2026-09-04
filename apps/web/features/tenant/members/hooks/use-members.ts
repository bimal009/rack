"use client"

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { MemberListQuery, NewMemberWithUser, UpdateMember } from "@repo/types"

import {
  createMember,
  deleteMember,
  getMemberList,
  updateMember,
} from "../api/member"

export function useMembersQuery(tenant: string, query: Partial<MemberListQuery> = {}) {
  return useQuery({
    queryKey: ["members", tenant, query],
    queryFn: () => getMemberList(tenant, query),
    enabled: Boolean(tenant),
    placeholderData: keepPreviousData,
  })
}

export function useCreateMember(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewMemberWithUser) => createMember(tenant, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", tenant] })
    },
  })
}

export function useUpdateMember(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; input: UpdateMember }) =>
      updateMember(tenant, vars.id, vars.input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", tenant] })
    },
  })
}

export function useDeleteMember(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteMember(tenant, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", tenant] })
    },
  })
}
