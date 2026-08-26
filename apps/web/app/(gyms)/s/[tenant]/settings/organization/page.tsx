import type { Metadata } from "next"

import { OrganizationPage } from "@/features/tenant/settings/organization/components/organization-page"

export const metadata: Metadata = {
  title: "Organization",
}

export default function Page() {
  return <OrganizationPage />
}
