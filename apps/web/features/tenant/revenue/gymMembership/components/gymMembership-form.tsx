"use client"

import { useState, type FormEvent } from "react"
import { useParams } from "next/navigation"
import { IdCard, UserPlus } from "lucide-react"
import { gymMembershipAssignmentSchema, type MemberWithUser, type NewGymMembership } from "@repo/types"

import { Button } from "@repo/ui/components/ui/button"
import { Field, FieldError, FieldLabel } from "@repo/ui/components/ui/field"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "@repo/ui/components/ui/sheet"
import { Spinner } from "@repo/ui/components/ui/spinner"

import { FormSheetHeader } from "@/features/tenant/components/form-section"
import {
  MembershipSection,
  newMembership,
  type MembershipValues,
} from "@/features/tenant/members/components/membership-section"
import { MemberCombobox } from "./member-combobox"

interface MembershipFormBodyProps {
  pending?: boolean
  onSubmit: (memberId: string, values: NewGymMembership) => void
  onCancel: () => void
}

function MembershipFormBody({ pending, onSubmit, onCancel }: MembershipFormBodyProps) {
  const tenant = useParams<{ id: string }>().id

  const [member, setMember] = useState<MemberWithUser | null>(null)
  const [membership, setMembership] = useState<MembershipValues>(newMembership)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!member) {
      setErrors({ member: "Select a member" })
      return
    }
    const result = gymMembershipAssignmentSchema.safeParse(membership)
    if (!result.success) {
      setErrors(
        Object.fromEntries(
          result.error.issues.map((issue) => [
            `membership.${issue.path.join(".")}`,
            issue.message,
          ])
        )
      )
      return
    }

    setErrors({})

    onSubmit(member.id, {
      memberId: member.id,
      ...result.data,
    } as NewGymMembership)
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <SheetHeader>
        <FormSheetHeader
          icon={UserPlus}
          title="Add membership"
          description="Assign a member to a plan."
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-6">
        <Field data-invalid={Boolean(errors.member)}>
          <FieldLabel>Member</FieldLabel>
          <MemberCombobox tenant={tenant} value={member} onChange={setMember} />
          <FieldError>{errors.member}</FieldError>
        </Field>

        <MembershipSection
          tenant={tenant}
          values={membership}
          onChange={setMembership}
          errors={errors}
        />
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? <Spinner /> : <IdCard className="size-4" />}
          Add membership
        </Button>
      </SheetFooter>
    </form>
  )
}

interface MembershipFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pending?: boolean
  onSubmit: (memberId: string, values: NewGymMembership) => void
}

export function GymMembershipFormSheet({
  open,
  onOpenChange,
  pending = false,
  onSubmit,
}: MembershipFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        {open && (
          <MembershipFormBody
            pending={pending}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}

