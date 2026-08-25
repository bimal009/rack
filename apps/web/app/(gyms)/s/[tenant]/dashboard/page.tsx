"use client"

import { authClient } from "@/auth-client"
import { SiteHeader } from "@/features/tenant/components/site-header"
import { WelcomeBanner } from "@/features/tenant/components/welcome-banner"
import { KpiCards } from "@/features/tenant/components/kpi-cards"
import { AttendanceChart } from "@/features/tenant/components/attendance-chart"
import { MembershipEndingList } from "@/features/tenant/components/membership-ending-list"
import { TodaysScheduleList } from "@/features/tenant/components/todays-schedule-list"
import { MembersTable } from "@/features/tenant/components/members-table"

export default function Page() {
  const { data: session } = authClient.useSession()

  return (
    <>
      <SiteHeader title="Dashboard" profile={session?.user} />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <WelcomeBanner profile={session?.user} />
        <KpiCards />
        <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <AttendanceChart />
          </div>
          <MembershipEndingList />
        </div>
        <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-3">
          <TodaysScheduleList />
          <div className="xl:col-span-2">
            <MembersTable />
          </div>
        </div>
      </div>
    </>
  )
}
