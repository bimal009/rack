import type { Metadata } from "next"

import { SelfCheckIn } from "@/features/tenant/attendance/components/self-check-in"

export const metadata: Metadata = {
  title: "Check In",
}

export default function Page() {
  return <SelfCheckIn />
}
