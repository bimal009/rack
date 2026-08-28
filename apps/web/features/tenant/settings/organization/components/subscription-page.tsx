"use client"

import { Check } from "lucide-react"

import { Badge } from "@repo/ui/components/ui/badge"
import { Button } from "@repo/ui/components/ui/button"

const includedFeatures = [
  "Unlimited members",
  "Unlimited staff seats",
  "Revenue & POS",
  "Scheduling & bookings",
  "Email & SMS notifications",
]

export function SubscriptionPage() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Manage your plan and billing details.
      </p>

      <div className="max-w-xl rounded-xl border border-border p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold text-foreground">Grow</p>
              <Badge className="rounded-full">Current plan</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              NPR 4,999/month · Renews 1 Sep 2026
            </p>
          </div>
          <Button variant="outline">Manage billing</Button>
        </div>

        <ul className="mt-5 flex flex-col gap-2.5 border-t border-border pt-5">
          {includedFeatures.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2.5 text-sm text-foreground"
            >
              <Check className="size-4 shrink-0 text-primary" />
              {feature}
            </li>
          ))}
        </ul>

        <Button className="mt-5 w-full">Upgrade to Enterprise</Button>
      </div>
    </div>
  )
}
