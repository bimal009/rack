import type { Metadata } from "next"

import { NotificationsPage } from "@/features/tenant/settings/organization/components/notifications-page"

export const metadata: Metadata = {
  title: "Notifications",
}

export default function Page() {
  return <NotificationsPage />
}
