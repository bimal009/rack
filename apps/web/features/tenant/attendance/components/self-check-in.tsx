"use client"

import { useState } from "react"
import { CheckCircle2 } from "lucide-react"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@repo/ui/components/ui/combobox"
import { Field, FieldLabel } from "@repo/ui/components/ui/field"

import { AuthHeader } from "@/features/auth/components/auth-header"
import { fullName } from "@/features/tenant/members/components/columns"
import { initialMembers } from "@/features/tenant/members/lib/data"

import { initialAttendance } from "../lib/data"
import { applyScan } from "../lib/scan"
import type { AttendanceRecord } from "../lib/schema"

interface Confirmation {
  message: string
  status: "in" | "out"
}

export function SelfCheckIn() {
  const [records, setRecords] = useState<AttendanceRecord[]>(initialAttendance)
  const [memberId, setMemberId] = useState<string | null>(null)
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)

  function handlePick(id: string | null) {
    setMemberId(id)
    if (!id) return

    const member = initialMembers.find((m) => m.id === id)
    if (!member) return

    const result = applyScan(
      records,
      { id: member.id, name: fullName(member), email: member.email },
      "QR"
    )
    setRecords(result.records)
    setConfirmation({ message: result.message, status: result.status })
  }

  function reset() {
    setConfirmation(null)
    setMemberId(null)
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 sm:px-12">
      <div className="w-full max-w-sm space-y-6">
        <AuthHeader />

        {confirmation ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center">
            <CheckCircle2 className="size-10 text-primary" />
            <div className="space-y-1.5">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                {confirmation.message}
              </h1>
              <p className="text-sm text-muted-foreground">
                {confirmation.status === "in"
                  ? "Have a great workout."
                  : "Thanks for stopping by."}
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="text-sm font-medium text-primary hover:underline"
            >
              Not you? Search again
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Check In
            </h1>
            <p className="text-sm text-muted-foreground">
              Find your name below to check in or out.
            </p>

            <Field className="pt-4">
              <FieldLabel htmlFor="self-check-in-member">
                Your name
              </FieldLabel>
              <Combobox
                items={initialMembers.map((m) => m.id)}
                itemToStringLabel={(id) => {
                  const found = initialMembers.find((m) => m.id === id)
                  return found ? `${fullName(found)} — ${found.email}` : id
                }}
                value={memberId}
                onValueChange={handlePick}
              >
                <ComboboxInput
                  id="self-check-in-member"
                  placeholder="Search your name or email..."
                />
                <ComboboxContent>
                  <ComboboxEmpty>No members found.</ComboboxEmpty>
                  <ComboboxList>
                    {(id: string) => {
                      const found = initialMembers.find((m) => m.id === id)
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
          </div>
        )}
      </div>
    </div>
  )
}
