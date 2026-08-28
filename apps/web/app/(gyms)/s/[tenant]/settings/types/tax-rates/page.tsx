import type { Metadata } from "next"
import { Percent } from "lucide-react"

import { initialTaxRates } from "@/features/tenant/settings/types/lib/data"
import { SimpleTypeList } from "@/features/tenant/settings/types/components/simple-type-list"

export const metadata: Metadata = {
  title: "Tax Rates",
}

export default function Page() {
  return (
    <SimpleTypeList
      icon={Percent}
      label="Tax Rate"
      idPrefix="tax"
      hasSlug={false}
      hasRate
      initialItems={initialTaxRates}
    />
  )
}
