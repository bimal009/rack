"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CreditCard, Layers, Receipt, ShoppingBag } from "lucide-react"

import { cn } from "@repo/ui/lib/utils"

const navItems = [
  { label: "Plans", segment: "plans", icon: CreditCard },
  { label: "Products", segment: "products", icon: ShoppingBag },
  { label: "Packages", segment: "packages", icon: Layers },
  { label: "Orders", segment: "orders", icon: Receipt },
]

interface RevenueNavProps {
  tenant: string
}

export function RevenueNav({ tenant }: RevenueNavProps) {
  const pathname = usePathname()
  const base = `/s/${tenant}/revenue`

  return (
    <nav className="flex items-center gap-1 overflow-x-auto border-b border-border">
      {navItems.map((item) => {
        const href = `${base}/${item.segment}`
        const active = pathname === href

        return (
          <Link
            key={item.label}
            href={href}
            className={cn(
              "relative flex shrink-0 items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors",
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
