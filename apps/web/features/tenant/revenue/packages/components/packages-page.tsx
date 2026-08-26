"use client"

import { authClient } from "@/auth-client"
import { SiteHeader } from "@/features/tenant/dashboard/components/site-header"
import { RevenueNav } from "@/features/tenant/revenue/components/revenue-nav"

import { PackagesList } from "./packages-list"

interface PackagesPageProps {
  tenant: string
}

export function PackagesPage({ tenant }: PackagesPageProps) {
  const { data: session } = authClient.useSession()

  return (
    <>
      <SiteHeader title="Packages" profile={session?.user} />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <RevenueNav tenant={tenant} />
        <PackagesList />
      </div>
    </>
  )
}
