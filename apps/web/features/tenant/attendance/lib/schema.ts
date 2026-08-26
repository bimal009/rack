export const attendanceMethods = ["QR", "Manual"] as const
export type AttendanceMethod = (typeof attendanceMethods)[number]

export const attendanceStatuses = ["Checked In", "Checked Out"] as const
export type AttendanceStatus = (typeof attendanceStatuses)[number]

export interface AttendanceRecord {
  id: string
  memberId: string
  memberName: string
  memberEmail: string
  date: string
  checkInAt: string
  checkOutAt?: string
  method: AttendanceMethod
  status: AttendanceStatus
}
