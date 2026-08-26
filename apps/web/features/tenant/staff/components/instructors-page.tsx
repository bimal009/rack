"use client"

import { authClient } from "@/auth-client"
import { SiteHeader } from "@/features/tenant/dashboard/components/site-header"

import { InstructorsList } from "./instructors-list"
import { StaffNav } from "./staff-nav"

interface InstructorsPageProps {
  tenant: string
}

export function InstructorsPage({ tenant }: InstructorsPageProps) {
  const { data: session } = authClient.useSession()

  return (
    <>
      <SiteHeader title="Instructors" profile={session?.user} />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <StaffNav tenant={tenant} />
        <InstructorsList />
      </div>
    </>
  )
}
