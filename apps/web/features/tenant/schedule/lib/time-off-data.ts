import { initialStaff } from "@/features/tenant/staff/lib/data"

import type { TimeOff } from "./time-off-schema"

const staff = initialStaff[2]

export const initialTimeOff: TimeOff[] = staff
  ? [
      {
        id: "off_1",
        staffId: staff.id,
        date: "2026-08-26",
        allDay: true,
        reason: "Personal leave",
      },
    ]
  : []

export function generateTimeOffId() {
  return `off_${Math.random().toString(36).slice(2, 10)}`
}
