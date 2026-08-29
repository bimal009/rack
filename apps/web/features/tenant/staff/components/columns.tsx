import type { StaffMember } from "../lib/schema"

export const payCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NPR",
  currencyDisplay: "code",
})

export function fullName(staff: Pick<StaffMember, "firstName" | "lastName">) {
  return `${staff.firstName} ${staff.lastName}`.trim()
}

export function initials(staff: Pick<StaffMember, "firstName" | "lastName">) {
  return ((staff.firstName[0] ?? "") + (staff.lastName[0] ?? "")).toUpperCase()
}
