import type { Metadata } from "next"

import { AreasPage } from "@/features/tenant/areas/components/areas-page"

export const metadata: Metadata = {
  title: "Areas",
}

export default function Page() {
  return <AreasPage />
}
