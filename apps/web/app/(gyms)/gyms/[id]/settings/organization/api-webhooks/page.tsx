import type { Metadata } from "next"

import { ApiWebhooksPage } from "@/features/tenant/settings/organization/components/api-webhooks-page"

export const metadata: Metadata = {
  title: "APIs & Webhooks",
}

export default function Page() {
  return <ApiWebhooksPage />
}
