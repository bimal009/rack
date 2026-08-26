import type { Metadata } from "next"

import { ClassTypesList } from "@/features/tenant/settings/types/components/class-types-list"

export const metadata: Metadata = {
  title: "Class Types",
}

export default function Page() {
  return <ClassTypesList />
}
