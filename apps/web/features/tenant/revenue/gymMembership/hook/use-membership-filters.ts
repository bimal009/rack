"use client"

import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs"

export const MEMBERSHIP_STATUSES = [
  "all",
  "Active",
  "Paused",
  "Expired",
  "Cancelled",
] as const

export function useMembershipFilters() {
  return useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      search: parseAsString.withDefault(""),
      status: parseAsStringLiteral(MEMBERSHIP_STATUSES).withDefault("all"),
      categoryId: parseAsString,
      sort: parseAsStringLiteral(["asc", "desc"] as const).withDefault("desc"),
    },
    {
      history: "replace",
      clearOnDefault: true,
    }
  )
}
