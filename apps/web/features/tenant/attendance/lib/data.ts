import { fullName, initialMembers } from "@/features/tenant/members/lib/data"

import type { AttendanceRecord } from "./schema"

function member(index: number) {
  return initialMembers[index] ?? initialMembers[0]!
}

export const initialAttendance: AttendanceRecord[] = [
  {
    id: "att_1",
    memberId: member(0).id,
    memberName: fullName(member(0)),
    memberEmail: member(0).email,
    date: "26 Aug 26",
    checkInAt: "06:12 AM",
    checkOutAt: "07:20 AM",
    method: "QR",
    status: "Checked Out",
  },
  {
    id: "att_2",
    memberId: member(1).id,
    memberName: fullName(member(1)),
    memberEmail: member(1).email,
    date: "26 Aug 26",
    checkInAt: "07:05 AM",
    method: "QR",
    status: "Checked In",
  },
  {
    id: "att_3",
    memberId: member(2).id,
    memberName: fullName(member(2)),
    memberEmail: member(2).email,
    date: "26 Aug 26",
    checkInAt: "08:30 AM",
    checkOutAt: "09:45 AM",
    method: "Manual",
    status: "Checked Out",
  },
  {
    id: "att_4",
    memberId: member(3).id,
    memberName: fullName(member(3)),
    memberEmail: member(3).email,
    date: "26 Aug 26",
    checkInAt: "09:10 AM",
    method: "QR",
    status: "Checked In",
  },
  {
    id: "att_5",
    memberId: member(4).id,
    memberName: fullName(member(4)),
    memberEmail: member(4).email,
    date: "25 Aug 26",
    checkInAt: "05:50 PM",
    checkOutAt: "07:00 PM",
    method: "QR",
    status: "Checked Out",
  },
]

export function generateAttendanceId() {
  return `att_${Math.random().toString(36).slice(2, 10)}`
}
