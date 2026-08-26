import type { Metadata } from "next"

import { PayRatesList } from "@/features/tenant/staff/components/pay-rates-list"

export const metadata: Metadata = {
  title: "Pay Rates",
}

export default function Page() {
  return <PayRatesList />
}
