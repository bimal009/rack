"use client"

import { authClient } from "@/auth-client"
import { SiteHeader } from "@/features/tenant/dashboard/components/site-header"
import { RevenueNav } from "@/features/tenant/revenue/components/revenue-nav"

import { ProductsList } from "./products-list"

interface ProductsPageProps {
  tenant: string
}

export function ProductsPage({ tenant }: ProductsPageProps) {
  const { data: session } = authClient.useSession()

  return (
    <>
      <SiteHeader title="Products" profile={session?.user} />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <RevenueNav tenant={tenant} />
        <ProductsList />
      </div>
    </>
  )
}
