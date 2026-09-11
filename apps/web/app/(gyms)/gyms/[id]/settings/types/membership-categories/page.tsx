import type { Metadata } from "next"

import { MembershipCategoriesList } from "@/features/tenant/settings/types/components/membership-categories-list"

export const metadata: Metadata = {
  title: "Membership Categories",
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <MembershipCategoriesList id={id} />
}
