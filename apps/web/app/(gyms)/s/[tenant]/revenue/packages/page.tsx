import type { Metadata } from "next"

import { PackagesPage } from "@/features/tenant/revenue/packages/components/packages-page"

export const metadata: Metadata = {
  title: "Packages",
}

export default async function Page({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  return <PackagesPage tenant={tenant} />
}
