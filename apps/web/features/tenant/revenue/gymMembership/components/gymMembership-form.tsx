"use client"

import { useState } from "react"
import { IdCard, UserPlus } from "lucide-react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  gymMembershipAssignmentSchema,
  type GymMembershipAssignment,
  type GymMembershipWithMemberAndPlan,
  type User,
  type NewGymMembership,
  type UpdateGymMembership,
} from "@repo/types"

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
} from "@/features/tenant/members/components/membership-section"
import { MemberCombobox } from "./member-combobox"

interface MembershipFormBodyProps {
  pending?: boolean
  onSubmit: (memberId: string, values: NewGymMembership) => void
  onUpdate?: (memberId: string, id: string, values: UpdateGymMembership) => void
  editingMembership?: GymMembershipWithMemberAndPlan | null
  onCancel: () => void
}

function MembershipFormBody({ tenant, pending, onSubmit, onUpdate, editingMembership, onCancel }: MembershipFormBodyProps & { tenant: string }) {

  const [member, setMember] = useState<Pick<User, "id" | "name" | "email" | "image"> | null>(
    editingMembership
      ? {
          id: editingMembership.member.id,
          name: editingMembership.member.user.name,
          email: editingMembership.member.user.email,
        }
      : null
  )
  const [memberError, setMemberError] = useState<string>()

  const form = useForm<GymMembershipAssignment>({
    resolver: zodResolver(gymMembershipAssignmentSchema) as never,
    defaultValues: editingMembership
      ? {
          planId: editingMembership.planId,
          status: editingMembership.status,
          startDate: editingMembership.startDate,
          price: editingMembership.price,
          signupFee: editingMembership.signupFee,
          extendedDays: editingMembership.extendedDays,
          extensionReason: editingMembership.extensionReason ?? "",
        }
      : newMembership(),
  })

  const onValid = form.handleSubmit((values) => {
    if (!member) {
      setMemberError("Select a member")
      return
    }
    setMemberError(undefined)

    if (editingMembership && onUpdate) {
      onUpdate(member.id, editingMembership.id, values as UpdateGymMembership)
      return
    }
    onSubmit(member.id, { memberId: member.id, ...values } as NewGymMembership)
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={onValid} className="flex h-full flex-col">
        <SheetHeader>
          <FormSheetHeader
            icon={UserPlus}
            title={editingMembership ? "Edit membership" : "Add membership"}
            description={editingMembership ? "Update this membership." : "Assign a member to a plan."}
          />
        </SheetHeader>

        <SheetBody className="flex flex-col gap-6">
          <Field data-invalid={Boolean(memberError)}>
            <FieldLabel>Member</FieldLabel>
            <MemberCombobox tenant={tenant} value={member} onChange={setMember} disabled={Boolean(editingMembership)} />
            <FieldError>{memberError}</FieldError>
          </Field>

          <MembershipSection tenant={tenant} selectedPlanName={editingMembership?.plan.name} />
        </SheetBody>

        <SheetFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? <Spinner /> : <IdCard className="size-4" />}
            {editingMembership ? "Save changes" : "Add membership"}
          </Button>
        </SheetFooter>
      </form>
    </FormProvider>
  )
}

interface MembershipFormSheetProps {
  tenant: string
  open: boolean
  onOpenChange: (open: boolean) => void
  pending?: boolean
  onSubmit: (memberId: string, values: NewGymMembership) => void
  onUpdate?: (memberId: string, id: string, values: UpdateGymMembership) => void
  editingMembership?: GymMembershipWithMemberAndPlan | null
}

export function GymMembershipFormSheet({
  tenant,
  open,
  onOpenChange,
  pending = false,
  onSubmit,
  onUpdate,
  editingMembership,
}: MembershipFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl">
        {open && (
          <MembershipFormBody
            key={editingMembership?.id ?? "new"}
            tenant={tenant}
            pending={pending}
            onSubmit={onSubmit}
            onUpdate={onUpdate}
            editingMembership={editingMembership}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
