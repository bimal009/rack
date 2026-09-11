import type { Metadata } from "next"

import { ProductFeaturesList } from "@/features/tenant/settings/types/components/product-features-list"

export const metadata: Metadata = {
  title: "Product Features",
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ProductFeaturesList id={id} />
}
