import { SiteHeader } from "@/features/tenant/dashboard/components/site-header"

import { ScheduleView } from "./schedule-view"

export function SchedulePage() {
  return (
    <>
      <SiteHeader title="Schedule" />
      <ScheduleView />
    </>
  )
}
