"use client"

import { authClient } from "@/auth-client"
import { SiteHeader } from "@/features/tenant/dashboard/components/site-header"

import { ClassTypesList } from "./class-types-list"
import { TypesNav } from "./types-nav"

interface ClassTypesPageProps {
  tenant: string
}

export function ClassTypesPage({ tenant }: ClassTypesPageProps) {
  const { data: session } = authClient.useSession()

  return (
    <>
      <SiteHeader title="Class Types" profile={session?.user} />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <TypesNav tenant={tenant} />
        <ClassTypesList />
      </div>
    </>
  )
}
