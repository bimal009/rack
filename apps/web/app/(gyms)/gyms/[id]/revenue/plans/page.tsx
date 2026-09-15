import type { Metadata } from "next"

import { PlansList } from "@/features/tenant/revenue/plans/components/plans-list"

export const metadata: Metadata = {
  title: "Plans",
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <PlansList tenant={id} />
}
