import type { Metadata } from "next"

import { BrandsList } from "@/features/tenant/settings/types/components/brands-list"

export const metadata: Metadata = {
  title: "Brands",
}

export default function Page() {
  return <BrandsList />
}
