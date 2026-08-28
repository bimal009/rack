import type { Metadata } from "next"

import { DoorLockPage } from "@/features/tenant/settings/organization/components/door-lock-page"

export const metadata: Metadata = {
  title: "Door Lock",
}

export default function Page() {
  return <DoorLockPage />
}
