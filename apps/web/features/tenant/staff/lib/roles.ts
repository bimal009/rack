import type { GymRole } from "@repo/types"

export const GYM_ROLE_LABELS: Record<GymRole, string> = {
  admin: "Admin",
  manager: "Manager",
  instructor: "Instructor",
  frontdesk: "Front Desk",
}

export function gymRoleLabel(role: GymRole) {
  return GYM_ROLE_LABELS[role]
}
