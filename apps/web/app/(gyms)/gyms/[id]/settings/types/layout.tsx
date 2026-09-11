import type { ReactNode } from "react"

import { TypesNav } from "@/features/tenant/settings/types/components/types-nav"

export default async function TypesLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  return (
    <>
      <h1 className="text-xl font-semibold text-foreground">Types</h1>
      <TypesNav tenant={tenant} />
      {children}
    </>
  )
}
