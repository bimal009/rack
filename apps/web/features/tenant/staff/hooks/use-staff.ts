"use client"

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { NewStaffWithUser, StaffListQuery } from "@repo/types"

import { useDebounce } from "@/hooks/use-debounce"

import { createStaff, getStaffList } from "../api/staff"
import { useStaffFilters } from "./use-staff-filters"

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


export function useStaffDirectory(tenant: string) {
  const [filters, setFilters] = useStaffFilters()
  const debouncedSearch = useDebounce(filters.search, 350)

  const params: StaffListQuery = {
    page: filters.page,
    search: debouncedSearch || undefined,
    role: filters.role ?? undefined,
    status: filters.status ?? undefined,
    sortOrder: filters.sortOrder,
  }

  const query = useStaffListQuery(tenant, params)

  return { filters, setFilters, params, query }
}
