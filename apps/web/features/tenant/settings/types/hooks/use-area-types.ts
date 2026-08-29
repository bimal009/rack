"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { NewAreaType } from "@repo/types"

import {
  createAreaType,
  deleteAreaType,
  listAreaTypes,
  updateAreaType,
} from "../api/area-type"

export function useAreaTypesQuery(tenant: string) {
  return useQuery({
    queryKey: ["settings", "area-types", tenant],
    queryFn: () => listAreaTypes(tenant),
    enabled: Boolean(tenant),
  })
}

export function useCreateAreaType(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewAreaType) => createAreaType(tenant, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "area-types", tenant],
      }),
  })
}

export function useUpdateAreaType(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; input: Partial<NewAreaType> }) =>
      updateAreaType(tenant, vars.id, vars.input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "area-types", tenant],
      }),
  })
}

export function useDeleteAreaType(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAreaType(tenant, id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["settings", "area-types", tenant],
      }),
  })
}
