import type { Metadata } from "next"

import { StaffPage } from "@/features/tenant/staff/components/staff-page"

export const metadata: Metadata = {
  title: "Staff",
}

export default async function Page({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  return <StaffPage tenant={tenant} />
}
