import type { Metadata } from "next"

import { MembershipsList } from "@/features/tenant/revenue/memberships/components/memberships-list"

export const metadata: Metadata = {
  title: "Memberships",
}

export default function Page() {
  return <MembershipsList />
}
