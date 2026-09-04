"use client"

import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs"

export const GYM_PLAN_STATUSES = ["active", "inactive"] as const

export function usePlanFilters() {
  return useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      search: parseAsString.withDefault(""),
      categoryId: parseAsString,
      status: parseAsStringLiteral(GYM_PLAN_STATUSES),
      sort: parseAsStringLiteral(["asc", "desc"] as const).withDefault("desc"),
    },
    {
      history: "replace",
      clearOnDefault: true,
    }
  )
}
