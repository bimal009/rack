import type { Metadata } from "next"

import { InstructorTypesList } from "@/features/tenant/settings/types/components/instructor-types-list"

export const metadata: Metadata = {
  title: "Instructor Types",
}

export default function Page() {
  return <InstructorTypesList />
}
