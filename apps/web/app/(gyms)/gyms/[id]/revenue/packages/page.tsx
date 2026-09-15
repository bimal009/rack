import type { Metadata } from "next"

import { PackagesList } from "@/features/tenant/revenue/packages/components/packages-list"

export const metadata: Metadata = {
  title: "Packages",
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <PackagesList tenant={id} />
}
