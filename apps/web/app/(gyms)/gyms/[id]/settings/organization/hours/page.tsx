import type { Metadata } from "next"

import { OrganizationHoursForm } from "@/features/tenant/settings/organization/components/organization-hours-form"

export const metadata: Metadata = {
  title: "Operating Hours",
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <OrganizationHoursForm tenant={id} />
}
