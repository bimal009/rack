import type { Metadata } from "next"

import { StaffList } from "@/features/tenant/staff/components/staff-list"

export const metadata: Metadata = {
  title: "Instructors",
}

export default function Page() {
  return <StaffList lockedRole="instructor" label="Instructor" />
}
