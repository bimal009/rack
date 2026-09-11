import type { Metadata } from "next"

import { AreaTypesList } from "@/features/tenant/settings/types/components/area-types-list"

export const metadata: Metadata = {
  title: "Area Types",
}

export default function Page() {
  return <AreaTypesList />
}
