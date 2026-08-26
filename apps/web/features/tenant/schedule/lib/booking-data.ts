import { initialMembers } from "@/features/tenant/members/lib/data"

import type { Booking } from "./booking-schema"

const member = initialMembers[0]

export const initialBookings: Booking[] = member
  ? [
      {
        id: "bkg_1",
        memberId: member.id,
        areaId: "area_2",
        date: "2026-08-27",
        startTime: "11:00",
        endTime: "12:00",
        notes: "",
      },
    ]
  : []

export function generateBookingId() {
  return `bkg_${Math.random().toString(36).slice(2, 10)}`
}
