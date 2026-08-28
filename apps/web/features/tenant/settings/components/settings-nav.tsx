"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bot,
  Building2,
  CircleUserRound,
  Smartphone,
  Tags,
} from "lucide-react"

import { cn } from "@repo/ui/lib/utils"

const categories = [
  { label: "Personal", icon: CircleUserRound },
  { label: "Organization", icon: Building2, segment: "organization" },
  { label: "Types", icon: Tags, segment: "types" },
  { label: "Member Apps", icon: Smartphone,badge:"Soon" },
  { label: "AI", icon: Bot ,badge:"Soon"},

]

interface SettingsNavProps {
  tenant: string
}

export function SettingsNav({ tenant }: SettingsNavProps) {
  const pathname = usePathname()
  const base = `/s/${tenant}/settings`

  return (
    <nav className="no-scrollbar scroll-fade-x flex w-full shrink-0 gap-1 overflow-x-auto md:w-56 md:flex-col md:gap-0.5 md:overflow-visible">
      {categories.map((item) => {
        const href = item.segment ? `${base}/${item.segment}` : undefined
        const active = href
          ? pathname === href || pathname.startsWith(`${href}/`)
          : false

        if (!href) {
          return (
            <span
              key={item.label}
              className="flex shrink-0 cursor-not-allowed items-center gap-2.5 rounded-lg px-3 py-2 text-sm whitespace-nowrap text-muted-foreground/50"
            >
              <item.icon className="size-4" />
              {item.label}
              {item.badge && (
                <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[0.65rem] font-semibold text-muted-foreground">
                  {item.badge}
                </span>
              )}
            </span>
          )
        }

        return (
          <Link
            key={item.label}
            href={href}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
