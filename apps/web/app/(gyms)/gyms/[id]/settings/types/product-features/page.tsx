import type { Metadata } from "next"

import { ProductFeaturesList } from "@/features/tenant/settings/types/components/product-features-list"

export const metadata: Metadata = {
  title: "Product Features",
}

export default function Page() {
  return <ProductFeaturesList />
}
