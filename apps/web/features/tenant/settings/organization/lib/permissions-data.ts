import { staffRoles, type StaffRole } from "@/features/tenant/staff/lib/schema"

export const roleNames = ["Admin", ...staffRoles] as const
export type RoleName = (typeof roleNames)[number]

export const accessLevels = ["No access", "View only", "Full access"] as const
export type AccessLevel = (typeof accessLevels)[number]

export const permissionCategories = [
  "Profile",
  "Notifications",
  "Members",
  "Memberships",
  "Attendance",
  "Schedule",
  "Classes",
  "Bookings",
  "Products",
  "Staff",
  "Payroll",
  "Pay Rates",
  "Point of sale",
  "Reports",
  "Types",
  "Website",
  "Permissions",
  "Settings",
] as const
export type PermissionCategory = (typeof permissionCategories)[number]

export type PermissionMatrix = Record<
  RoleName,
  Record<PermissionCategory, AccessLevel>
>

function allAccess(level: AccessLevel): Record<PermissionCategory, AccessLevel> {
  return Object.fromEntries(
    permissionCategories.map((c) => [c, level])
  ) as Record<PermissionCategory, AccessLevel>
}

export const defaultPermissions: PermissionMatrix = {
  Admin: allAccess("Full access"),
  Manager: {
    ...allAccess("Full access"),
    Settings: "View only",
    Permissions: "No access",
  },
  "Front Desk": {
    Profile: "Full access",
    Notifications: "View only",
    Members: "Full access",
    Memberships: "Full access",
    Attendance: "Full access",
    Schedule: "View only",
    Classes: "View only",
    Bookings: "Full access",
    Products: "View only",
    Staff: "No access",
    Payroll: "No access",
    "Pay Rates": "No access",
    "Point of sale": "Full access",
    Reports: "View only",
    Types: "No access",
    Website: "No access",
    Permissions: "No access",
    Settings: "No access",
  },
  Instructor: {
    Profile: "Full access",
    Notifications: "View only",
    Members: "View only",
    Memberships: "No access",
    Attendance: "Full access",
    Schedule: "View only",
    Classes: "Full access",
    Bookings: "View only",
    Products: "No access",
    Staff: "No access",
    Payroll: "No access",
    "Pay Rates": "No access",
    "Point of sale": "No access",
    Reports: "No access",
    Types: "No access",
    Website: "No access",
    Permissions: "No access",
    Settings: "No access",
  },
}

export const defaultRoles: readonly RoleName[] = staffRoles

export function isDefaultRole(role: RoleName): role is StaffRole {
  return (defaultRoles as readonly string[]).includes(role)
}
