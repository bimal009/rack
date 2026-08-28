import type { Metadata } from "next"

import { SubscriptionPage } from "@/features/tenant/settings/organization/components/subscription-page"

export const metadata: Metadata = {
  title: "Subscription",
}

export default function Page() {
  return <SubscriptionPage />
}
