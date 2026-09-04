"use client"

import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs"

export const PRODUCT_STATUSES = ["active", "inactive"] as const

export function useProductFilters() {
  return useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      search: parseAsString.withDefault(""),
      categoryId: parseAsString,
      featureId: parseAsString,
      status: parseAsStringLiteral(PRODUCT_STATUSES),
      sort: parseAsStringLiteral(["asc", "desc"] as const).withDefault("desc"),
    },
    {
      history: "replace",
      clearOnDefault: true,
    }
  )
}
