"use client"

import { authClient } from "@/auth-client"
import { SiteHeader } from "@/features/tenant/dashboard/components/site-header"

import { InstructorTypesList } from "./instructor-types-list"
import { TypesNav } from "./types-nav"

interface InstructorTypesPageProps {
  tenant: string
}

export function InstructorTypesPage({ tenant }: InstructorTypesPageProps) {
  const { data: session } = authClient.useSession()

  return (
    <>
      <SiteHeader title="Instructor Types" profile={session?.user} />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <TypesNav tenant={tenant} />
        <InstructorTypesList />
      </div>
    </>
  )
}
