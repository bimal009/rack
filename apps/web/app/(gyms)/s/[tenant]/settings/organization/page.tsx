import type { Metadata } from "next"

import { OrganizationPage } from "@/features/tenant/settings/organization/components/organization-page"

export const metadata: Metadata = {
  title: "Organization",
}

export default async function Page({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  return <OrganizationPage tenant={tenant} />
}
