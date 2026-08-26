import type { Metadata } from "next"

import { PosPage } from "@/features/tenant/revenue/orders/components/pos/pos-page"

export const metadata: Metadata = {
  title: "New Sale",
}

export default async function Page({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  return <PosPage tenant={tenant} />
}
