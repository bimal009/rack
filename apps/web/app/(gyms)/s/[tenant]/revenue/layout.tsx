import type { ReactNode } from "react"

import { RevenueLayoutShell } from "@/features/tenant/revenue/components/revenue-layout-shell"

export default async function RevenueLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  return <RevenueLayoutShell tenant={tenant}>{children}</RevenueLayoutShell>
}
