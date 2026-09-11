import type { Metadata } from "next"

import { StaffList } from "@/features/tenant/staff/components/staff-list"

export const metadata: Metadata = {
  title: "Staff",
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <StaffList id={id} />
}
