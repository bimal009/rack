"use client"

import { useRef, useState, type KeyboardEvent } from "react"
import { CheckCircle2, QrCode, XCircle } from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@repo/ui/components/ui/combobox"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@repo/ui/components/ui/field"
import { Input } from "@repo/ui/components/ui/input"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@repo/ui/components/ui/sheet"
import { cn } from "@repo/ui/lib/utils"

import { fullName } from "@/features/tenant/members/components/columns"
import type { Member } from "@/features/tenant/members/lib/schema"

interface ScanResult {
  key: number
  ok: boolean
  message: string
}

interface CheckInBodyProps {
  members: Member[]
  onScan: (member: Member) => string
  onClose: () => void
}

function CheckInBody({ members, onScan, onClose }: CheckInBodyProps) {
  const [scanValue, setScanValue] = useState("")
  const [comboValue, setComboValue] = useState<string | null>(null)
  const [log, setLog] = useState<ScanResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  function recordResult(ok: boolean, message: string) {
    setLog((prev) => [{ key: Date.now() + Math.random(), ok, message }, ...prev].slice(0, 6))
  }

  function runScan(member: Member | undefined, rawValue: string) {
    if (!member) {
      recordResult(false, `No member found for "${rawValue}"`)
      return
    }
    const message = onScan(member)
    recordResult(true, message)
  }

  function handleScanKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return
    event.preventDefault()
    const value = scanValue.trim()
    if (!value) return
    const member = members.find((m) => m.id === value)
    runScan(member, value)
    setScanValue("")
    inputRef.current?.focus()
  }

  function handleManualPick(memberId: string | null) {
    setComboValue(memberId)
    if (!memberId) return
    const member = members.find((m) => m.id === memberId)
    runScan(member, memberId)
    setComboValue(null)
  }

  return (
    <div className="flex h-full flex-col">
      <SheetHeader>
        <SheetTitle>Check In</SheetTitle>
        <SheetDescription>
          Scan a member&apos;s QR code, or search for them manually. Scanning
          an already checked-in member checks them out.
        </SheetDescription>
      </SheetHeader>

      <SheetBody className="flex flex-col gap-6">
        <FieldSet>
          <FieldLegend>Scan</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="attendance-scan">
                Scan QR code or enter member ID
              </FieldLabel>
              <div className="relative">
                <QrCode className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="attendance-scan"
                  ref={inputRef}
                  autoFocus
                  autoComplete="off"
                  placeholder="Waiting for scan..."
                  className="pl-9"
                  value={scanValue}
                  onChange={(e) => setScanValue(e.target.value)}
                  onKeyDown={handleScanKeyDown}
                />
              </div>
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Or search manually</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="attendance-member">Member</FieldLabel>
              <Combobox
                items={members.map((m) => m.id)}
                itemToStringLabel={(id) => {
                  const found = members.find((m) => m.id === id)
                  return found ? `${fullName(found)} — ${found.email}` : id
                }}
                value={comboValue}
                onValueChange={handleManualPick}
              >
                <ComboboxInput
                  id="attendance-member"
                  placeholder="Search member..."
                />
                <ComboboxContent>
                  <ComboboxEmpty>No members found.</ComboboxEmpty>
                  <ComboboxList>
                    {(id: string) => {
                      const found = members.find((m) => m.id === id)
                      return (
                        <ComboboxItem key={id} value={id}>
                          {found ? `${fullName(found)} — ${found.email}` : id}
                        </ComboboxItem>
                      )
                    }}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
          </FieldGroup>
        </FieldSet>

        {log.length > 0 && (
          <FieldSet>
            <FieldLegend variant="label">Recent scans</FieldLegend>
            <div className="flex flex-col gap-1.5">
              {log.map((entry) => (
                <div
                  key={entry.key}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                    entry.ok
                      ? "border-primary/20 bg-primary/5 text-foreground"
                      : "border-destructive/20 bg-destructive/5 text-destructive"
                  )}
                >
                  {entry.ok ? (
                    <CheckCircle2 className="size-4 shrink-0 text-primary" />
                  ) : (
                    <XCircle className="size-4 shrink-0 text-destructive" />
                  )}
                  <span className="truncate">{entry.message}</span>
                </div>
              ))}
            </div>
          </FieldSet>
        )}
      </SheetBody>

      <SheetFooter>
        <Button type="button" onClick={onClose}>
          Done
        </Button>
      </SheetFooter>
    </div>
  )
}

interface CheckInSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  members: Member[]
  onScan: (member: Member) => string
}

export function CheckInSheet({
  open,
  onOpenChange,
  members,
  onScan,
}: CheckInSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        {open && (
          <CheckInBody
            key="check-in"
            members={members}
            onScan={onScan}
            onClose={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
