import type { ReactNode } from "react"

import { OrganizationTabs } from "@/features/tenant/settings/organization/components/organization-tabs"

export default async function OrganizationLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  return (
    <>
      <h1 className="text-xl font-semibold text-foreground">Organization</h1>
      <OrganizationTabs tenant={tenant} />
      {children}
    </>
  )
}
