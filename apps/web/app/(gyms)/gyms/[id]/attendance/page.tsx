import type { Metadata } from "next"

import { AttendancePage } from "@/features/tenant/attendance/components/attendance-page"

export const metadata: Metadata = {
  title: "Attendance",
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <AttendancePage id={id} />
}
