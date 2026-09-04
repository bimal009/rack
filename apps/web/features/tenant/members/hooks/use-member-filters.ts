"use client"

import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs"

export const MEMBER_STATUSES = ["Active", "On Hold", "Expired"] as const

export function useMemberFilters() {
  return useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      search: parseAsString.withDefault(""),
      status: parseAsStringLiteral(MEMBER_STATUSES),
      sort: parseAsStringLiteral(["asc", "desc"] as const).withDefault("desc"),
    },
    {
      history: "replace",
      clearOnDefault: true,
    }
  )
}
