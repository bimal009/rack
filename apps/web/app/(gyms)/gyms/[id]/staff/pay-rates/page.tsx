import type { Metadata } from "next"

import { PayRatesList } from "@/features/tenant/staff/components/pay-rates-list"

export const metadata: Metadata = {
  title: "Pay Rates",
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <PayRatesList id={id} />
}
