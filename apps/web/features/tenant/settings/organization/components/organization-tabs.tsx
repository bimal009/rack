"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@repo/ui/lib/utils"

const tabs = [
  { label: "Details", segment: "details" },
  { label: "Hours", segment: "hours" },
  { label: "Subscription", segment: "subscription" },
  { label: "Permissions", segment: "permissions" },
  { label: "Notifications", segment: "notifications" },
  { label: "Domains", segment: "domains" },
  { label: "APIs & webhooks", segment: "api-webhooks" },
  { label: "Door Lock", segment: "door-lock" },
]

interface OrganizationTabsProps {
  tenant: string
}

export function OrganizationTabs({ tenant }: OrganizationTabsProps) {
  const pathname = usePathname()
  const base = `/s/${tenant}/settings/organization`

  return (
    <div className="no-scrollbar scroll-fade-x flex items-center gap-4 overflow-x-auto border-b border-border">
      {tabs.map((tab) => {
        const href = `${base}/${tab.segment}`
        const active = pathname === href

        return (
          <Link
            key={tab.label}
            href={href}
            className={cn(
              "relative shrink-0 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />
            )}
          </Link>
        )
      })}
    </div>
  )
}
