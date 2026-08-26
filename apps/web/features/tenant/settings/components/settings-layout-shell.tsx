"use client"

import type { ReactNode } from "react"

import { authClient } from "@/auth-client"
import { SiteHeader } from "@/features/tenant/dashboard/components/site-header"

import { SettingsNav } from "./settings-nav"

interface SettingsLayoutShellProps {
  tenant: string
  children: ReactNode
}

export function SettingsLayoutShell({
  tenant,
  children,
}: SettingsLayoutShellProps) {
  const { data: session } = authClient.useSession()

  return (
    <>
      <SiteHeader title="Settings" profile={session?.user} />
      <div className="flex flex-1 flex-col gap-6 p-4 md:flex-row md:gap-8 md:p-6">
        <SettingsNav tenant={tenant} />
        <div className="flex min-w-0 flex-1 flex-col gap-4">{children}</div>
      </div>
    </>
  )
}
