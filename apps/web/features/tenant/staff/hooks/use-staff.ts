"use client"

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { NewStaffWithUser, StaffListQuery, UpdateStaff } from "@repo/types"

import {
  createStaff,
  deleteStaff,
  getStaffList,
  updateStaff,
} from "../api/staff"

export function useStaffListQuery(
  tenant: string,
  query: Partial<StaffListQuery>
) {
  return useQuery({
    queryKey: ["staff", tenant, query],
    queryFn: () => getStaffList(tenant, query),
    enabled: Boolean(tenant),
    placeholderData: keepPreviousData,
  })
}

export function useCreateStaffMutation(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewStaffWithUser) => createStaff(tenant, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", tenant] })
    },
  })
}

export function useUpdateStaffMutation(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; input: UpdateStaff }) =>
      updateStaff(tenant, vars.id, vars.input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", tenant] })
    },
  })
}

export function useDeleteStaffMutation(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteStaff(tenant, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", tenant] })
    },
  })
}
