import type { Metadata } from "next"
import { Tag } from "lucide-react"

import { initialBrands } from "@/features/tenant/settings/types/lib/data"
import { SimpleTypeList } from "@/features/tenant/settings/types/components/simple-type-list"

export const metadata: Metadata = {
  title: "Brands",
}

export default function Page() {
  return (
    <SimpleTypeList
      icon={Tag}
      label="Brand"
      idPrefix="brand"
      hasSlug
      hasRate={false}
      initialItems={initialBrands}
    />
  )
}
