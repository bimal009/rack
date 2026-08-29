"use client"

import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs"

export function useTypeFilters() {
  return useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(20),
      search: parseAsString.withDefault(""),
      sort: parseAsStringLiteral(["asc", "desc"] as const).withDefault("asc"),
    },
    {
      history: "replace",
      clearOnDefault: true,
    }
  )
}
