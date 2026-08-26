import type { ReactNode } from "react"

import { SettingsLayoutShell } from "@/features/tenant/settings/components/settings-layout-shell"

export default async function SettingsLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  return <SettingsLayoutShell tenant={tenant}>{children}</SettingsLayoutShell>
}
