"use client"

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { AreaListQuery, NewArea, UpdateArea } from "@repo/types"

import { createArea, deleteArea, listAreas, updateArea } from "../api/area"

const areasKey = (tenant: string) => ["areas", tenant]

export function useAreasQuery(
  tenant: string,
  query: Partial<AreaListQuery> = {}
) {
  return useQuery({
    queryKey: [...areasKey(tenant), query],
    queryFn: () => listAreas(tenant, query),
    enabled: Boolean(tenant),
    placeholderData: keepPreviousData,
  })
}

export function useCreateArea(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewArea) => createArea(tenant, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: areasKey(tenant) }),
  })
}

export function useUpdateArea(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; input: UpdateArea }) =>
      updateArea(tenant, vars.id, vars.input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: areasKey(tenant) }),
  })
}

export function useDeleteArea(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteArea(tenant, id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: areasKey(tenant) }),
  })
}
