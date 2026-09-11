import type { Metadata } from "next"

import { BrandsList } from "@/features/tenant/settings/types/components/brands-list"

export const metadata: Metadata = {
  title: "Brands",
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <BrandsList id={id} />
}
