"use client"

import { authClient } from "@/auth-client"
import { SiteHeader } from "@/features/tenant/dashboard/components/site-header"

import { PayrollList } from "./payroll-list"
import { StaffNav } from "./staff-nav"

interface PayrollPageProps {
  tenant: string
}

export function PayrollPage({ tenant }: PayrollPageProps) {
  const { data: session } = authClient.useSession()

  return (
    <>
      <SiteHeader title="Payroll" profile={session?.user} />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <StaffNav tenant={tenant} />
        <PayrollList />
      </div>
    </>
  )
}
