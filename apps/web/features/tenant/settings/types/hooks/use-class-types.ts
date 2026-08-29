"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { NewClassType } from "@repo/types"

import {
  createClassType,
  deleteClassType,
  listClassTypes,
  updateClassType,
} from "../api/class-type"

export function useClassTypesQuery(tenant: string) {
  return useQuery({
    queryKey: ["settings", "class-types", tenant],
    queryFn: () => listClassTypes(tenant),
    enabled: Boolean(tenant),
  })
}

export function useCreateClassType(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewClassType) => createClassType(tenant, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "class-types", tenant],
      }),
  })
}

export function useUpdateClassType(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; input: Partial<NewClassType> }) =>
      updateClassType(tenant, vars.id, vars.input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "class-types", tenant],
      }),
  })
}

export function useDeleteClassType(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteClassType(tenant, id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "class-types", tenant],
      }),
  })
}
