import type { Metadata } from "next"

import { TaxRatesList } from "@/features/tenant/settings/types/components/tax-rates-list"

export const metadata: Metadata = {
  title: "Tax Rates",
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <TaxRatesList id={id} />
}
