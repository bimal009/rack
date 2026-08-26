"use client"

import { useState } from "react"
import QRCode from "react-qr-code"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog"

function CheckInQrBody({ tenant }: { tenant: string }) {
  const [url] = useState(() => `${window.location.origin}/attend/${tenant}`)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center justify-center rounded-xl border border-border bg-white p-6">
        <QRCode value={url} size={192} />
      </div>
      <p className="text-center text-xs break-all text-muted-foreground">
        {url}
      </p>
    </div>
  )
}

interface CheckInQrDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenant: string
}

export function CheckInQrDialog({
  open,
  onOpenChange,
  tenant,
}: CheckInQrDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Check-in QR</DialogTitle>
          <DialogDescription>
            Display this at the front desk. Members scan it with their phone
            to check themselves in or out.
          </DialogDescription>
        </DialogHeader>

        {open && <CheckInQrBody key={tenant} tenant={tenant} />}
      </DialogContent>
    </Dialog>
  )
}
