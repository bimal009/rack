import type { Metadata } from "next"

import { OrganizationHoursForm } from "@/features/tenant/settings/organization/components/organization-hours-form"

export const metadata: Metadata = {
  title: "Operating Hours",
}

export default function Page() {
  return <OrganizationHoursForm />
}
