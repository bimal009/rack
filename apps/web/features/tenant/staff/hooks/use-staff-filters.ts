"use client"

import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs"

export const STAFF_ROLES = ["admin", "manager", "instructor", "frontdesk"] as const
export const STAFF_STATUSES = ["active", "inactive"] as const
export const STAFF_SORT_ORDERS = ["asc", "desc"] as const


export function useStaffFilters() {
  return useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      search: parseAsString.withDefault(""),
      role: parseAsStringLiteral(STAFF_ROLES),
      status: parseAsStringLiteral(STAFF_STATUSES),
      sortOrder: parseAsStringLiteral(STAFF_SORT_ORDERS).withDefault("desc"),
    },
    {
      history: "replace",
      clearOnDefault: true,
    }
  )
}
