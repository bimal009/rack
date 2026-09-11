import type { Metadata } from "next"

import { AttendancePage } from "@/features/tenant/attendance/components/attendance-page"

export const metadata: Metadata = {
  title: "Attendance",
}

export default async function Page({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  return <AttendancePage tenant={tenant} />
}
