import type { Metadata } from "next"

import { AreasPage } from "@/features/tenant/areas/components/areas-page"

export const metadata: Metadata = {
  title: "Areas",
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <AreasPage tenant={id} />
}
