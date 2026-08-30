import type { Metadata } from "next"

import { MembershipCategoriesList } from "@/features/tenant/settings/types/components/membership-categories-list"

export const metadata: Metadata = {
  title: "Membership Categories",
}

export default function Page() {
  return <MembershipCategoriesList />
}
