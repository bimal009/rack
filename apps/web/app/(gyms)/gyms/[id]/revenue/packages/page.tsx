import type { Metadata } from "next"

import { PackagesList } from "@/features/tenant/revenue/packages/components/packages-list"

export const metadata: Metadata = {
  title: "Packages",
}

export default function Page() {
  return <PackagesList />
}
