import type { Metadata } from "next"

import { ClassTypesList } from "@/features/tenant/settings/types/components/class-types-list"

export const metadata: Metadata = {
  title: "Class Types",
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ClassTypesList id={id} />
}
