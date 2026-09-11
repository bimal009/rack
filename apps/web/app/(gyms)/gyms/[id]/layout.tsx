import { AppSidebar } from "@/features/tenant/dashboard/components/app-sidebar"

import { SidebarInset, SidebarProvider } from "@repo/ui/components/ui/sidebar"

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" tenant={id} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
