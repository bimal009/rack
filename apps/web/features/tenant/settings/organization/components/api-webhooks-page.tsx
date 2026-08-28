"use client"

import { Webhook } from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"

import { UpsellPanel } from "./upsell-panel"

export function ApiWebhooksPage() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Connect Rackrage to your own tools and systems.
      </p>

      <UpsellPanel
        icon={Webhook}
        badge="Enterprise"
        title="APIs & Webhooks"
        description="Push real-time events to your own systems and pull data through the Rackrage API."
        bullets={[
          "REST API access with scoped API keys",
          "Webhooks for bookings, payments, and check-ins",
          "Dedicated support for integration work",
        ]}
        action={<Button>Upgrade to Enterprise</Button>}
      />
    </div>
  )
}
