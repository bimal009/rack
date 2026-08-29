"use client"

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { NewInstructorType, InstructorTypeListQuery } from "@repo/types"

import {
  createInstructorType,
  deleteInstructorType,
  listInstructorTypes,
  updateInstructorType,
} from "../api/instructor-type"

export function useInstructorTypesQuery(
  tenant: string,
  query: Partial<InstructorTypeListQuery> = {}
) {
  return useQuery({
    queryKey: [...["settings", "instructor-types", tenant], query],
    queryFn: () => listInstructorTypes(tenant, query),
    enabled: Boolean(tenant),
    placeholderData: keepPreviousData,
  })
}

export function useCreateInstructorType(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewInstructorType) =>
      createInstructorType(tenant, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "instructor-types", tenant],
      }),
  })
}

export function useUpdateInstructorType(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; input: Partial<NewInstructorType> }) =>
      updateInstructorType(tenant, vars.id, vars.input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "instructor-types", tenant],
      }),
  })
}

export function useDeleteInstructorType(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteInstructorType(tenant, id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "instructor-types", tenant],
      }),
  })
}
