import type { Metadata } from "next"

import { InstructorsList } from "@/features/tenant/staff/components/instructors-list"

export const metadata: Metadata = {
  title: "Instructors",
}

export default function Page() {
  return <InstructorsList />
}
