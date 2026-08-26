"use client"

import { authClient } from "@/auth-client"
import { SiteHeader } from "@/features/tenant/dashboard/components/site-header"

import { MembersList } from "./members-list"

export function MembersPage() {
  const { data: session } = authClient.useSession()

  return (
    <>
      <SiteHeader title="Members" profile={session?.user} />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <MembersList />
      </div>
    </>
  )
}
