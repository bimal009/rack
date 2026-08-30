import type { Metadata } from "next"

import { PlanCategoriesList } from "@/features/tenant/settings/types/components/plan-categories-list"

export const metadata: Metadata = {
  title: "Plan Categories",
}

export default function Page() {
  return <PlanCategoriesList />
}
