import type { Metadata } from "next"

import { OrdersPage } from "@/features/tenant/revenue/orders/components/orders-page"

export const metadata: Metadata = {
  title: "Orders",
}

export default async function Page({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  return <OrdersPage tenant={tenant} />
}
