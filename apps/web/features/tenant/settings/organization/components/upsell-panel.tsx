"use client"

import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { Check } from "lucide-react"

import { Badge } from "@repo/ui/components/ui/badge"

interface UpsellPanelProps {
  icon: LucideIcon
  badge: string
  title: string
  description: string
  bullets: string[]
  action: ReactNode
}

export function UpsellPanel({
  icon: Icon,
  badge,
  title,
  description,
  bullets,
  action,
}: UpsellPanelProps) {
  return (
    <div className="flex max-w-xl flex-col items-center gap-4 rounded-xl border border-dashed border-border px-8 py-12 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-6" />
      </span>

      <div className="space-y-1.5">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <Badge className="rounded-full">{badge}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <ul className="flex flex-col gap-2 self-stretch text-left">
        {bullets.map((bullet) => (
          <li
            key={bullet}
            className="flex items-center gap-2.5 text-sm text-foreground"
          >
            <Check className="size-4 shrink-0 text-primary" />
            {bullet}
          </li>
        ))}
      </ul>

      {action}
    </div>
  )
}
