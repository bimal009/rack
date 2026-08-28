"use client"

import { useState } from "react"
import { CircleCheck, DoorClosed } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@repo/ui/components/ui/button"

import { UpsellPanel } from "./upsell-panel"

export function DoorLockPage() {
  const [applied, setApplied] = useState(false)

  function handleApply() {
    setApplied(true)
    toast.success("Application submitted. Our team will reach out within 2 business days.")
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Let members unlock the gym door with their membership, no keycard
        needed.
      </p>

      <UpsellPanel
        icon={DoorClosed}
        badge="Hardware"
        title="Smart Door Lock"
        description="Connect a compatible smart lock so members can check in and enter with their phone or QR code."
        bullets={[
          "Auto-unlock for members with an active plan",
          "Entry logs synced with attendance",
          "Works with supported smart lock hardware",
        ]}
        action={
          applied ? (
            <Button disabled variant="outline">
              <CircleCheck className="size-4" />
              Application submitted
            </Button>
          ) : (
            <Button onClick={handleApply}>Apply for door lock access</Button>
          )
        }
      />
    </div>
  )
}
