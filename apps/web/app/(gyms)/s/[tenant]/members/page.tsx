"use client"

import { authClient } from "@/auth-client"
import { SiteHeader } from "@/features/tenant/components/site-header"
import { MembersList } from "@/features/tenant/components/members-list"

export default function Page() {
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
