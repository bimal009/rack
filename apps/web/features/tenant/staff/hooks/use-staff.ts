"use client"

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { NewStaffWithUser, StaffListQuery } from "@repo/types"

import { createStaff, getStaffList } from "../api/staff"

export function useStaffListQuery(tenant: string, params: StaffListQuery) {
  return useQuery({
    queryKey: ["staff", tenant, params],
    queryFn: () => getStaffList(tenant, params),
    placeholderData: keepPreviousData,
    enabled: Boolean(tenant),
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
