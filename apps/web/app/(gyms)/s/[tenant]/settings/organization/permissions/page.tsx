import type { Metadata } from "next"

import { PermissionsPage } from "@/features/tenant/settings/organization/components/permissions-page"

export const metadata: Metadata = {
  title: "Permissions",
}

export default function Page() {
  return <PermissionsPage />
}
