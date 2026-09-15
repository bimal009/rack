import GymMembershipList from "@/features/tenant/revenue/gymMembership/components/gymMembership-list"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Membership",
}

export default async function MembershipPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: tenant } = await params
  return <GymMembershipList tenant={tenant} />
}
