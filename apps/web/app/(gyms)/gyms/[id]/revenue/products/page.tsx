import type { Metadata } from "next"

import { ProductsList } from "@/features/tenant/revenue/products/components/products-list"

export const metadata: Metadata = {
  title: "Products",
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ProductsList tenant={id} />
}
