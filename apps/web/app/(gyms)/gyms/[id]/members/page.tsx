import type { Metadata } from "next"

import { MembersPage } from "@/features/tenant/members/components/members-page"

export const metadata: Metadata = {
  title: "Members",
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <MembersPage id={id} />
}
