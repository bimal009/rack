"use client"

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { GymSportListQuery, NewGymSport } from "@repo/types"

import {
  createGymSport,
  deleteGymSport,
  listGymSports,
  updateGymSport,
} from "../api/gym-sport"

export function useGymSportsQuery(
  tenant: string,
  query: Partial<GymSportListQuery> = {}
) {
  return useQuery({
    queryKey: ["settings", "sports", tenant, query],
    queryFn: () => listGymSports(tenant, query),
    enabled: Boolean(tenant),
    placeholderData: keepPreviousData,
  })
}

export function useCreateGymSport(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewGymSport) => createGymSport(tenant, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["settings", "sports", tenant] }),
  })
}

export function useUpdateGymSport(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; input: Partial<NewGymSport> }) =>
      updateGymSport(tenant, vars.id, vars.input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["settings", "sports", tenant] }),
  })
}

export function useDeleteGymSport(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteGymSport(tenant, id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["settings", "sports", tenant] }),
  })
}
