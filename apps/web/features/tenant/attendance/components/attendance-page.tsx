import { SiteHeader } from "@/features/tenant/dashboard/components/site-header"

import { AttendanceList } from "./attendance-list"

interface AttendancePageProps {
  tenant: string
}

export function AttendancePage({ tenant }: AttendancePageProps) {
  return (
    <>
      <SiteHeader title="Attendance" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <AttendanceList tenant={tenant} />
      </div>
    </>
  )
}
