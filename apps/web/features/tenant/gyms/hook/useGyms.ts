"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchMyGym, updateMyGym } from "../api/gyms"


export function useGymQuery() {
  return useQuery({
    queryKey: ["gym"],
    queryFn: fetchMyGym,
  })
}

export function useUpdateGymMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateMyGym,
    onSuccess: (gym) => {
      queryClient.setQueryData(["gym"], gym)
    },
  })
}
