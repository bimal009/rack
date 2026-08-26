"use client"

import type { ReactNode } from "react"

import { authClient } from "@/auth-client"
import { SiteHeader } from "@/features/tenant/dashboard/components/site-header"

import { RevenueNav } from "./revenue-nav"

interface RevenueLayoutShellProps {
  tenant: string
  children: ReactNode
}

export function RevenueLayoutShell({
  tenant,
  children,
}: RevenueLayoutShellProps) {
  const { data: session } = authClient.useSession()

  return (
    <>
      <SiteHeader title="Revenue" profile={session?.user} />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <RevenueNav tenant={tenant} />
        {children}
      </div>
    </>
  )
}
