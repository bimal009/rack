import type { Metadata } from "next"

import { CategoriesList } from "@/features/tenant/settings/types/components/categories-list"

export const metadata: Metadata = {
  title: "Categories",
}

export default function Page() {
  return <CategoriesList />
}
