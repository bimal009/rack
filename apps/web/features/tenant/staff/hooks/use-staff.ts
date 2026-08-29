"use client"

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { NewStaffWithUser, StaffListQuery } from "@repo/types"

import { createStaff, getStaffList } from "../api/staff"

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
