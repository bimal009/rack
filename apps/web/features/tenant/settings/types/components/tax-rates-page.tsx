"use client"

import { authClient } from "@/auth-client"
import { SiteHeader } from "@/features/tenant/dashboard/components/site-header"

import { initialTaxRates } from "../lib/data"
import { SimpleTypeList } from "./simple-type-list"
import { TypesNav } from "./types-nav"

interface TaxRatesPageProps {
  tenant: string
}

export function TaxRatesPage({ tenant }: TaxRatesPageProps) {
  const { data: session } = authClient.useSession()

  return (
    <>
      <SiteHeader title="Tax Rates" profile={session?.user} />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <TypesNav tenant={tenant} />
        <SimpleTypeList
          label="Tax Rate"
          idPrefix="tax"
          hasSlug={false}
          hasRate
          initialItems={initialTaxRates}
        />
      </div>
    </>
  )
}
