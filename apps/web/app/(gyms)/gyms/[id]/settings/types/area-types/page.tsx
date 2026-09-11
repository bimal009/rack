import type { Metadata } from "next"

import { AreaTypesList } from "@/features/tenant/settings/types/components/area-types-list"

export const metadata: Metadata = {
  title: "Area Types",
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <AreaTypesList id={id} />
}
