"use client"

import { authClient } from "@/auth-client"
import { SiteHeader } from "@/features/tenant/dashboard/components/site-header"

import { AreaTypesList } from "./area-types-list"
import { TypesNav } from "./types-nav"

interface AreaTypesPageProps {
  tenant: string
}

export function AreaTypesPage({ tenant }: AreaTypesPageProps) {
  const { data: session } = authClient.useSession()

  return (
    <>
      <SiteHeader title="Area Types" profile={session?.user} />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <TypesNav tenant={tenant} />
        <AreaTypesList />
      </div>
    </>
  )
}
