"use client"

import QRCode from "react-qr-code"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog"

import type { Member } from "../lib/schema"
import { fullName } from "./columns"

interface MemberQrDialogProps {
  member: Member | null
  onOpenChange: (open: boolean) => void
}

export function MemberQrDialog({ member, onOpenChange }: MemberQrDialogProps) {
  return (
    <Dialog open={Boolean(member)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{member ? fullName(member) : ""}</DialogTitle>
          <DialogDescription>
            Scan this code at the front desk to check in or out.
          </DialogDescription>
        </DialogHeader>

        {member && (
          <div className="flex items-center justify-center rounded-xl border border-border bg-white p-6">
            <QRCode value={member.id} size={192} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
