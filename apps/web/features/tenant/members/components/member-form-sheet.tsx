"use client"

import { useState } from "react"
import { CalendarIcon, IdCard, MapPin, Minus, Plus, UserRound } from "lucide-react"
import { toast } from "sonner"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  isSyntheticEmail,
  memberGenderEnumSchema,
  memberStatusEnumSchema,
  memberWithUserAndMembershipInsertSchema,
  type MemberWithUser,
  type NewMemberWithUser,
} from "@repo/types"

import { Button } from "@repo/ui/components/ui/button"
import { Calendar } from "@repo/ui/components/ui/calendar"
import { Field, FieldError, FieldLabel } from "@repo/ui/components/ui/field"
import { Input } from "@repo/ui/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@repo/ui/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "@repo/ui/components/ui/sheet"
import { Spinner } from "@repo/ui/components/ui/spinner"

import { FormSheetHeader } from "@/features/tenant/components/form-section"

import { useCreateMember, useUpdateMember } from "../hooks/use-members"
import { formatDate, MembershipSection, newMembership } from "./membership-section"

type MemberFormValues = z.input<typeof memberWithUserAndMembershipInsertSchema>

function defaultValues(member?: MemberWithUser | null): MemberFormValues {
  if (!member) {
    return {
      user: { name: "", email: "" },
      member: { status: "Active", phone: "", dateOfBirth: "", gender: "", address: "" },
      membership: newMembership(),
    }
  }
  return {
    user: { name: member.user.name, email: isSyntheticEmail(member.user.email) ? "" : member.user.email },
    member: {
      status: member.status,
      phone: member.phone ?? "",
      dateOfBirth: member.dateOfBirth ?? "",
      gender: member.gender ?? "",
      address: member.address ?? "",
    },
  }
}

interface MemberFormSheetProps {
  tenant: string
  open: boolean
  onOpenChange: (open: boolean) => void
  member?: MemberWithUser | null
}

export function MemberFormSheet({ tenant, open, onOpenChange, member }: MemberFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl">
        {open && (
          <MemberForm key={member?.id ?? "new"} tenant={tenant} member={member} onClose={() => onOpenChange(false)} />
        )}
      </SheetContent>
    </Sheet>
  )
}

function MemberForm({ tenant, member, onClose }: { tenant: string; member?: MemberWithUser | null; onClose: () => void }) {
  const isEdit = Boolean(member)
  const [hasMembership, setHasMembership] = useState(false)
  const createMember = useCreateMember(tenant)
  const updateMember = useUpdateMember(tenant)
  const pending = isEdit ? updateMember.isPending : createMember.isPending

  const form = useForm<MemberFormValues, unknown, NewMemberWithUser>({
    defaultValues: defaultValues(member),
    resolver: zodResolver(memberWithUserAndMembershipInsertSchema),
  })

  const { register, control, handleSubmit, formState: { errors } } = form

  const onSubmit = handleSubmit((data) => {
    if (isEdit && member) {
      updateMember.mutate(
        { id: member.id, input: { user: data.user, member: data.member } },
        {
          onSuccess: () => {
            toast.success(`${data.user?.name ?? member.user.name} updated`)
            onClose()
          },
          onError: (error) => toast.error(error.message),
        }
      )
      return
    }

    createMember.mutate(
      { ...data, membership: hasMembership ? data.membership : undefined },
      {
        onSuccess: (created) => {
          toast.success(`${created.user.name} added`)
          onClose()
        },
        onError: (error) => toast.error(error.message),
      }
    )
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="flex h-full flex-col">
        <SheetHeader className="flex-row items-center justify-between">
          <FormSheetHeader
            icon={UserRound}
            title={isEdit ? "Edit member" : "Add member"}
            description={isEdit ? "Update this member's profile." : "Creates a user account and adds them as a member."}
          />
        </SheetHeader>

        <SheetBody className="flex flex-col gap-6">
          <section className="border-t border-border/70 pt-5 first:border-t-0 first:pt-0">
            <h3 className="mb-4 text-sm font-semibold">Basic information</h3>
            <Field data-invalid={Boolean(errors.user?.name)}>
              <FieldLabel htmlFor="member-name">
                Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input id="member-name" placeholder="Jane Doe" aria-invalid={Boolean(errors.user?.name)} {...register("user.name")} />
              <FieldError>{errors.user?.name?.message}</FieldError>
            </Field>

            <Field data-invalid={Boolean(errors.user?.email)}>
              <FieldLabel htmlFor="member-email">Email</FieldLabel>
              <Input
                id="member-email"
                type="email"
                placeholder="jane@example.com (optional)"
                aria-invalid={Boolean(errors.user?.email)}
                {...register("user.email")}
              />
              <FieldError>{errors.user?.email?.message}</FieldError>
            </Field>

            <Field data-invalid={Boolean(errors.member?.phone)}>
              <FieldLabel htmlFor="member-phone">
                Phone <span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>+977</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="member-phone"
                  type="tel"
                  placeholder="98XXXXXXXX"
                  aria-invalid={Boolean(errors.member?.phone)}
                  {...register("member.phone")}
                />
              </InputGroup>
              <FieldError>{errors.member?.phone?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="member-status">Status</FieldLabel>
              <Controller
                control={control}
                name="member.status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="member-status" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {memberStatusEnumSchema.options.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="member-dob">Date of Birth</FieldLabel>
                <Controller
                  control={control}
                  name="member.dateOfBirth"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            id="member-dob"
                            type="button"
                            variant="outline"
                            className="w-full justify-start font-normal data-[empty=true]:text-muted-foreground"
                            data-empty={!field.value}
                          />
                        }
                      >
                        <CalendarIcon className="size-4" />
                        {field.value
                          ? new Date(`${field.value}T00:00:00`).toLocaleDateString(undefined, {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Pick a date"}
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          startMonth={new Date(1940, 0)}
                          endMonth={new Date()}
                          disabled={{ after: new Date() }}
                          selected={field.value ? new Date(`${field.value}T00:00:00`) : undefined}
                          onSelect={(date) => field.onChange(date ? formatDate(date) : "")}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="member-gender">Gender</FieldLabel>
                <Controller
                  control={control}
                  name="member.gender"
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <SelectTrigger id="member-gender" className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {memberGenderEnumSchema.options.map((gender) => (
                          <SelectItem key={gender} value={gender}>
                            {gender}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </div>
          </section>

          <section className="border-t border-border/70 pt-5">
            <h3 className="mb-4 text-sm font-semibold">Address</h3>
            <Field>
              <FieldLabel htmlFor="member-address">Address</FieldLabel>
              <Input id="member-address" placeholder="Street, city, postcode" {...register("member.address")} />
            </Field>
          </section>

          {!isEdit && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setHasMembership((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5"
              >
                {hasMembership ? (
                  <>
                    <Minus className="size-4" />
                    Remove Membership
                  </>
                ) : (
                  <>
                    <Plus className="size-4" />
                    Add Membership
                  </>
                )}
              </button>
            </div>
          )}

          {!isEdit && hasMembership && <MembershipSection tenant={tenant} namePrefix="membership" />}
        </SheetBody>

        <SheetFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? <Spinner /> : <IdCard className="size-4" />}
            {isEdit ? "Save changes" : "Add member"}
          </Button>
        </SheetFooter>
      </form>
    </FormProvider>
  )
}
