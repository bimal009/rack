import type { Metadata } from "next"

import { ProductsList } from "@/features/tenant/revenue/products/components/products-list"

export const metadata: Metadata = {
  title: "Products",
}

export default function Page() {
  return <ProductsList />
}
