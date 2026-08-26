"use client"

import { authClient } from "@/auth-client"
import { SiteHeader } from "@/features/tenant/dashboard/components/site-header"
import { RevenueNav } from "@/features/tenant/revenue/components/revenue-nav"

import { OrdersList } from "./orders-list"

interface OrdersPageProps {
  tenant: string
}

export function OrdersPage({ tenant }: OrdersPageProps) {
  const { data: session } = authClient.useSession()

  return (
    <>
      <SiteHeader title="Orders" profile={session?.user} />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <RevenueNav tenant={tenant} />
        <OrdersList />
      </div>
    </>
  )
}
