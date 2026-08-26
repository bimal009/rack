"use client"

import { authClient } from "@/auth-client"
import { SiteHeader } from "@/features/tenant/dashboard/components/site-header"
import { SettingsNav } from "@/features/tenant/settings/components/settings-nav"

import { OrganizationDetailsForm } from "./organization-details-form"
import { OrganizationTabs } from "./organization-tabs"

interface OrganizationPageProps {
  tenant: string
}

export function OrganizationPage({ tenant }: OrganizationPageProps) {
  const { data: session } = authClient.useSession()

  return (
    <>
      <SiteHeader title="Settings" profile={session?.user} />
      <div className="flex flex-1 flex-col gap-6 p-4 md:flex-row md:gap-8 md:p-6">
        <SettingsNav tenant={tenant} />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <h1 className="text-xl font-semibold text-foreground">
            Organization
          </h1>
          <OrganizationTabs />
          <OrganizationDetailsForm />
        </div>
      </div>
    </>
  )
}
