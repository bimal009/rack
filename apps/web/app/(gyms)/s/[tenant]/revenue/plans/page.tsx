import type { Metadata } from "next"

import { PlansPage } from "@/features/tenant/revenue/plans/components/plans-page"

export const metadata: Metadata = {
  title: "Plans",
}

export default async function Page({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  return <PlansPage tenant={tenant} />
}
