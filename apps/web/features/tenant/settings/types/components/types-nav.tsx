"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@repo/ui/lib/utils"

const navItems = [
  { label: "Area Types", segment: "area-types" },
  { label: "Instructor Types", segment: "instructor-types" },
  { label: "Class Types", segment: "class-types" },
  { label: "Brands", segment: "brands" },
  { label: "Tax Rates", segment: "tax-rates" },
  { label: "Product Categories", segment: "product-categories" },
  { label: "Membership Categories", segment: "membership-categories" },
]

interface TypesNavProps {
  tenant: string
}

export function TypesNav({ tenant }: TypesNavProps) {
  const pathname = usePathname()
  const base = `/s/${tenant}/settings/types`
  const activeRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" })
  }, [])

  return (
    <div className="no-scrollbar scroll-fade-x flex items-center gap-4 overflow-x-auto border-b border-border">
      {navItems.map((item) => {
        const href = `${base}/${item.segment}`
        const active = pathname === href

        return (
          <Link
            key={item.label}
            href={href}
            ref={active ? activeRef : undefined}
            className={cn(
              "relative shrink-0 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />
            )}
          </Link>
        )
      })}
    </div>
  )
}
