"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BadgeDollarSign, Dumbbell, Percent, Users } from "lucide-react"

import { cn } from "@repo/ui/lib/utils"

const navItems = [
  { label: "Staff", segment: "directory", icon: Users },
  { label: "Instructors", segment: "instructors", icon: Dumbbell },
  { label: "Payroll", segment: "payroll", icon: BadgeDollarSign },
  { label: "Pay Rates", segment: "pay-rates", icon: Percent },
]

interface StaffNavProps {
  tenant: string
}

export function StaffNav({ tenant }: StaffNavProps) {
  const pathname = usePathname()
  const base = `/s/${tenant}/staff`
  const activeRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" })
  }, [])

  return (
    <nav className="no-scrollbar scroll-fade-x flex items-center gap-1 overflow-x-auto overflow-y-hidden border-b border-border">
      {navItems.map((item) => {
        const href = `${base}/${item.segment}`
        const active = pathname === href

        return (
          <Link
            key={item.label}
            href={href}
            ref={active ? activeRef : undefined}
            className={cn(
              "relative flex shrink-0 items-center gap-1.5 px-2.5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors sm:px-3",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="size-4" />
            {item.label}
            {active && (
              <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
