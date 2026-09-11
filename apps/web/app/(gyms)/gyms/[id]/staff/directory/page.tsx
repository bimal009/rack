import type { Metadata } from "next"

import { StaffList } from "@/features/tenant/staff/components/staff-list"

export const metadata: Metadata = {
  title: "Staff",
}

export default function Page() {
  return <StaffList />
}
