import type { Metadata } from "next"

import { initialCategories } from "@/features/tenant/settings/types/lib/data"
import { SimpleTypeList } from "@/features/tenant/settings/types/components/simple-type-list"

export const metadata: Metadata = {
  title: "Categories",
}

export default function Page() {
  return (
    <SimpleTypeList
      icon="LayoutGrid"
      label="Category"
      idPrefix="cat"
      hasSlug
      hasRate={false}
      initialItems={initialCategories}
    />
  )
}
