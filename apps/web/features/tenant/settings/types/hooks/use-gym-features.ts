"use client"

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { GymFeatureListQuery, NewGymFeature } from "@repo/types"

import {
  createGymFeature,
  deleteGymFeature,
  listGymFeatures,
  updateGymFeature,
} from "../api/gym-feature"

export function useGymFeaturesQuery(
  tenant: string,
  query: Partial<GymFeatureListQuery> = {}
) {
  return useQuery({
    queryKey: ["settings", "features", tenant, query],
    queryFn: () => listGymFeatures(tenant, query),
    enabled: Boolean(tenant),
    placeholderData: keepPreviousData,
  })
}

export function useCreateGymFeature(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewGymFeature) => createGymFeature(tenant, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["settings", "features", tenant] }),
  })
}

export function useUpdateGymFeature(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; input: Partial<NewGymFeature> }) =>
      updateGymFeature(tenant, vars.id, vars.input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["settings", "features", tenant] }),
  })
}

export function useDeleteGymFeature(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteGymFeature(tenant, id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["settings", "features", tenant] }),
  })
}
