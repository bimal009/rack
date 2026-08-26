"use client"

import { authClient } from "@/auth-client"
import { SiteHeader } from "@/features/tenant/dashboard/components/site-header"

import { initialBrands } from "../lib/data"
import { SimpleTypeList } from "./simple-type-list"
import { TypesNav } from "./types-nav"

interface BrandsPageProps {
  tenant: string
}

export function BrandsPage({ tenant }: BrandsPageProps) {
  const { data: session } = authClient.useSession()

  return (
    <>
      <SiteHeader title="Brands" profile={session?.user} />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <TypesNav tenant={tenant} />
        <SimpleTypeList
          label="Brand"
          idPrefix="brand"
          hasSlug
          hasRate={false}
          initialItems={initialBrands}
        />
      </div>
    </>
  )
}
