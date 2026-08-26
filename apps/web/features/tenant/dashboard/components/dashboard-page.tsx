"use client"

import { authClient } from "@/auth-client"

import { AttendanceChart } from "./attendance-chart"
import { KpiCards } from "./kpi-cards"
import { MembershipEndingList } from "./membership-ending-list"
import { SiteHeader } from "./site-header"
import { TodaysScheduleList } from "./todays-schedule-list"
import { WelcomeBanner } from "./welcome-banner"
import { MembersTable } from "../../components/members-table"

export function DashboardPage() {
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
