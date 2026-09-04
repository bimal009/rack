"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { OpeningHours } from "@repo/types"

import { getOperatingHours, updateOperatingHours } from "../api/operating-hours"

const operatingHoursKey = (tenant: string) => ["operating-hours", tenant]

export function useOperatingHoursQuery(tenant: string) {
  return useQuery({
    queryKey: operatingHoursKey(tenant),
    queryFn: () => getOperatingHours(tenant),
    enabled: Boolean(tenant),
  })
}

export function useUpdateOperatingHours(tenant: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (hours: OpeningHours) => updateOperatingHours(tenant, hours),
    onSuccess: (hours) => {
      queryClient.setQueryData(operatingHoursKey(tenant), hours)
    },
  })
}
