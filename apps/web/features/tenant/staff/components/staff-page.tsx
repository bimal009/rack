"use client"

import { authClient } from "@/auth-client"
import { SiteHeader } from "@/features/tenant/dashboard/components/site-header"

import { StaffList } from "./staff-list"

export function StaffPage() {
  const { data: session } = authClient.useSession()

  return (
    <>
      <SiteHeader title="Staff" profile={session?.user} />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <StaffList />
      </div>
    </>
  )
}
