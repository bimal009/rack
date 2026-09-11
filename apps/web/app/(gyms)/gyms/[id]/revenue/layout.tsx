import type { ReactNode } from "react"

import { SiteHeader } from "@/features/tenant/dashboard/components/site-header"
import { RevenueNav } from "@/features/tenant/revenue/components/revenue-nav"

export default async function RevenueLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  return (
    <>
      <SiteHeader title="Revenue" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <RevenueNav tenant={tenant} />
        {children}
      </div>
    </>
  )
}
