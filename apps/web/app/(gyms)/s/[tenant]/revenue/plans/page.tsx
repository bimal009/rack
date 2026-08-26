import type { Metadata } from "next"

import { PlansList } from "@/features/tenant/revenue/plans/components/plans-list"

export const metadata: Metadata = {
  title: "Plans",
}

export default function Page() {
  return <PlansList />
}
