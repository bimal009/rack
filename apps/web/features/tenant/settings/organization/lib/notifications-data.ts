import { staffRoles } from "@/features/tenant/staff/lib/schema"

export const notificationRoleNames = ["Admin", ...staffRoles, "Member"] as const
export type NotificationRoleName = (typeof notificationRoleNames)[number]

export const notificationChannels = ["Email", "SMS"] as const
export type NotificationChannel = (typeof notificationChannels)[number]

export interface NotificationType {
  key: string
  label: string
}

export const notificationTypes: NotificationType[] = [
  { key: "new-booking", label: "New Booking" },
  { key: "booking-reminder", label: "Booking Reminder" },
  { key: "booking-cancelled", label: "Booking Cancelled" },
  { key: "payment-received", label: "Payment Received" },
  { key: "payment-failed", label: "Payment Failed" },
  { key: "membership-expiring", label: "Membership Expiring" },
  { key: "class-cancelled", label: "Class Cancelled" },
  { key: "new-message", label: "New Message" },
  { key: "task-assigned", label: "Task Assigned" },
  { key: "attendance-checkin", label: "Attendance Check-in" },
]

export interface NotificationSetting {
  enabled: boolean
  channels: NotificationChannel[]
  allowUsersToChange: boolean
}

export type NotificationMatrix = Record<
  NotificationRoleName,
  Record<string, NotificationSetting>
>

function defaultRowsForRole(role: NotificationRoleName): Record<string, NotificationSetting> {
  const staffOnly = ["task-assigned"]
  const memberOnly = ["membership-expiring"]

  return Object.fromEntries(
    notificationTypes.map((type) => {
      const isStaffOnlyForMember = role === "Member" && staffOnly.includes(type.key)
      const isMemberOnlyForStaff = role !== "Member" && memberOnly.includes(type.key)
      const enabled = !isStaffOnlyForMember && !isMemberOnlyForStaff

      return [
        type.key,
        {
          enabled,
          channels: enabled ? (["Email"] as NotificationChannel[]) : [],
          allowUsersToChange: true,
        },
      ]
    })
  )
}

export const defaultNotifications: NotificationMatrix = Object.fromEntries(
  notificationRoleNames.map((role) => [role, defaultRowsForRole(role)])
) as NotificationMatrix
