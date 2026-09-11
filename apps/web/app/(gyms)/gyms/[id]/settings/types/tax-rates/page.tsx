import type { Metadata } from "next"

import { TaxRatesList } from "@/features/tenant/settings/types/components/tax-rates-list"

export const metadata: Metadata = {
  title: "Tax Rates",
}

export default function Page() {
  return <TaxRatesList />
}
