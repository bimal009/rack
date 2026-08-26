import type { Metadata } from "next"

import { ProductsPage } from "@/features/tenant/revenue/products/components/products-page"

export const metadata: Metadata = {
  title: "Products",
}

export default async function Page({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  return <ProductsPage tenant={tenant} />
}
