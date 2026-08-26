import type { ReactNode } from "react"

import { SiteHeader } from "@/features/tenant/dashboard/components/site-header"
import { StaffNav } from "@/features/tenant/staff/components/staff-nav"

export default async function StaffLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  return (
    <>
      <SiteHeader title="Staff" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <StaffNav tenant={tenant} />
        {children}
      </div>
    </>
  )
}
