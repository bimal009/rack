"use client"

import { useQuery } from "@tanstack/react-query"

import { listPublicPlans } from "../api/plans"

export function usePublicPlansQuery() {
  return useQuery({
    queryKey: ["public-plans"],
    queryFn: listPublicPlans,
    staleTime: 5 * 60 * 1000,
  })
}
