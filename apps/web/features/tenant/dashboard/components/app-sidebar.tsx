"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ClipboardCheck,
  Dumbbell,
  LayoutGrid,
  LogOut,
  Rocket,
  Settings,
  UserRoundCog,
  Users,
  Wallet,
} from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/ui/sidebar"
import { authClient } from "@/auth-client"

const mainNav = [
  { title: "Dashboard", icon: LayoutGrid, segment: "dashboard" },
  { title: "Members", icon: Users, segment: "members" },
  { title: "Revenue", icon: Wallet, segment: "revenue/plans", match: "revenue" },
  { title: "Attendance", icon: ClipboardCheck, segment: "attendance" },
  { title: "Staff", icon: UserRoundCog, segment: "staff/directory", match: "staff" },
]

const accountNav = [
  { title: "Settings", icon: Settings, segment: "settings" },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  tenant: string
}

export function AppSidebar({ tenant, ...props }: AppSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  async function handleLogOut() {
    await authClient.signOut()
    router.push("/login")
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="px-3 pt-4 pb-2">
        <div className="flex items-center gap-2.5 px-1">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Dumbbell className="size-5" />
          </span>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-base font-semibold text-foreground">
              Rackrage
            </span>
            <span className="text-xs text-muted-foreground">
              Gym Dashboard
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[0.65rem] font-semibold tracking-wider text-muted-foreground/80 uppercase">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {mainNav.map((item) => {
                const href = item.segment
                  ? `/s/${tenant}/${item.segment}`
                  : undefined
                const matchSegment = item.match ?? item.segment
                const matchHref = matchSegment
                  ? `/s/${tenant}/${matchSegment}`
                  : undefined
                const active = matchHref
                  ? pathname === matchHref ||
                    pathname?.startsWith(`${matchHref}/`)
                  : false

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={active}
                      render={
                        href ? (
                          <Link href={href}>
                            <item.icon className="size-4.5" />
                            <span>{item.title}</span>
                          </Link>
                        ) : undefined
                      }
                      className={
                        active
                          ? "h-10 rounded-xl bg-primary font-medium text-primary-foreground hover:bg-primary hover:text-primary-foreground data-active:bg-primary data-active:text-primary-foreground"
                          : "h-10 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
                      }
                    >
                      {!href && (
                        <>
                          <item.icon className="size-4.5" />
                          <span>{item.title}</span>
                        </>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[0.65rem] font-semibold tracking-wider text-muted-foreground/80 uppercase">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {accountNav.map((item) => {
                const href = item.segment
                  ? `/s/${tenant}/${item.segment}`
                  : undefined
                const active = href
                  ? pathname === href || pathname?.startsWith(`${href}/`)
                  : false

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={active}
                      render={
                        href ? (
                          <Link href={href}>
                            <item.icon className="size-4.5" />
                            <span>{item.title}</span>
                          </Link>
                        ) : undefined
                      }
                      className={
                        active
                          ? "h-10 rounded-xl bg-muted font-medium text-foreground"
                          : "h-10 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
                      }
                    >
                      {!href && (
                        <>
                          <item.icon className="size-4.5" />
                          <span>{item.title}</span>
                        </>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogOut}
                  className="h-10 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="size-4.5" />
                  <span>Log Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 group-data-[collapsible=icon]:hidden">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary to-primary/70 p-4 text-primary-foreground">
          <div className="pointer-events-none absolute -top-8 -right-10 size-28 rounded-full bg-primary-foreground/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-6 size-24 rounded-full bg-primary-foreground/5 blur-2xl" />
          <Rocket className="relative size-5 text-primary-foreground/90" />
          <p className="relative mt-2.5 text-sm font-semibold">
            Upgrade to Grow
          </p>
          <p className="relative mt-1 text-xs leading-relaxed text-primary-foreground/75">
            Unlock more perks and features to grow your gym.
          </p>
          <Button
            size="sm"
            className="relative mt-3.5 w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            Upgrade Plan
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
