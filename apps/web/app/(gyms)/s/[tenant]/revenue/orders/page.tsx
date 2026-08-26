import type { Metadata } from "next"

import { OrdersList } from "@/features/tenant/revenue/orders/components/orders-list"

export const metadata: Metadata = {
  title: "Orders",
}

export default function Page() {
  return <OrdersList />
}
