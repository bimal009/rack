import type { Metadata } from "next"

import { OrganizationDetailsForm } from "@/features/tenant/settings/organization/components/organization-details-form"

export const metadata: Metadata = {
  title: "Organization",
}

export default function Page() {
  return <OrganizationDetailsForm />
}
