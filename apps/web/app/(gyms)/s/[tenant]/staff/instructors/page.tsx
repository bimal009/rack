import type { Metadata } from "next"

import { InstructorsPage } from "@/features/tenant/staff/components/instructors-page"

export const metadata: Metadata = {
  title: "Instructors",
}

export default async function Page({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  return <InstructorsPage tenant={tenant} />
}
