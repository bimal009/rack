import type { ReactNode } from "react"

import { SiteHeader } from "@/features/tenant/dashboard/components/site-header"
import { SettingsNav } from "@/features/tenant/settings/components/settings-nav"

export default async function SettingsLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  return (
    <>
      <SiteHeader title="Settings" />
      <div className="flex flex-1 flex-col gap-6 p-4 md:flex-row md:gap-8 md:p-6">
        <SettingsNav tenant={tenant} />
        <div className="flex min-w-0 flex-1 flex-col gap-4">{children}</div>
      </div>
    </>
  )
}
