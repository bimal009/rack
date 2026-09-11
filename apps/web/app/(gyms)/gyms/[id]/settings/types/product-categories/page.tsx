import type { Metadata } from "next"

import { ProductCategoriesList } from "@/features/tenant/settings/types/components/product-categories-list"

export const metadata: Metadata = {
  title: "Product Categories",
}

export default function Page() {
  return <ProductCategoriesList />
}
