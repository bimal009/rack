import type { Metadata } from "next"

import { DomainsPage } from "@/features/tenant/settings/organization/components/domains-page"

export const metadata: Metadata = {
  title: "Domains",
}

export default function Page() {
  return <DomainsPage />
}
