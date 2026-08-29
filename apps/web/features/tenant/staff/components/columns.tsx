import type { StaffMember } from "../lib/schema"

export function fullName(staff: Pick<StaffMember, "firstName" | "lastName">) {
  return `${staff.firstName} ${staff.lastName}`.trim()
}

export function initials(staff: Pick<StaffMember, "firstName" | "lastName">) {
  return ((staff.firstName[0] ?? "") + (staff.lastName[0] ?? "")).toUpperCase()
}
