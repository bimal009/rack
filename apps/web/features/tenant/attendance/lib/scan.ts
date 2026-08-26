import { generateAttendanceId } from "./data"
import { nowTime, today } from "./time"
import type { AttendanceMethod, AttendanceRecord } from "./schema"

interface ScannedMember {
  id: string
  name: string
  email: string
}

export function applyScan(
  records: AttendanceRecord[],
  member: ScannedMember,
  method: AttendanceMethod
): { records: AttendanceRecord[]; message: string; status: "in" | "out" } {
  const openRecord = records.find(
    (r) => r.memberId === member.id && r.status === "Checked In"
  )

  if (openRecord) {
    return {
      records: records.map((r) =>
        r.id === openRecord.id
          ? { ...r, checkOutAt: nowTime(), status: "Checked Out" }
          : r
      ),
      message: `See you later, ${member.name}!`,
      status: "out",
    }
  }

  const record: AttendanceRecord = {
    id: generateAttendanceId(),
    memberId: member.id,
    memberName: member.name,
    memberEmail: member.email,
    date: today(),
    checkInAt: nowTime(),
    method,
    status: "Checked In",
  }

  return {
    records: [record, ...records],
    message: `You're checked in, ${member.name}!`,
    status: "in",
  }
}
