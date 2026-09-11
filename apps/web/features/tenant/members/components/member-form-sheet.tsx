"use client"

import { useState, type FormEvent } from "react"
import { CalendarIcon, IdCard, MapPin, UserRound } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"
import {
  isSyntheticEmail,
  memberFieldsSchema,
  memberGenderEnumSchema,
  memberStatusEnumSchema,
  memberUpdateSchema,
  memberUserFieldsSchema,
  memberWithUserInsertSchema,
  type MemberWithUser,
} from "@repo/types"

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar"
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

import { FormSection, FormSheetHeader } from "@/features/tenant/components/form-section"
import { ImageUpload } from "@/features/media"

import { useCreateMember, useUpdateMember } from "../hooks/use-members"
import { fieldErrors } from "../lib/validation"
import { initials } from "./columns"

type MemberUserValues = z.input<typeof memberUserFieldsSchema>
type MemberFieldValues = z.input<typeof memberFieldsSchema>

interface MemberFormValues {
  user: MemberUserValues
  member: MemberFieldValues
}

function toFormValues(member?: MemberWithUser | null): MemberFormValues {
  if (!member) {
    return {
      user: { name: "", email: "", image: "" },
      member: {
        status: "Active",
        phone: "",
        dateOfBirth: "",
        gender: "",
        address: "",
      },
    }
  }

  return {
    user: {
      name: member.user.name,
      email: isSyntheticEmail(member.user.email) ? "" : member.user.email,
      image: member.user.image ?? "",
    },
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

export function MemberFormSheet({
  tenant,
  open,
  onOpenChange,
  member,
}: MemberFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        {open && (
          <MemberForm
            key={member?.id ?? "new"}
            tenant={tenant}
            member={member}
            onClose={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}

function MemberForm({
  tenant,
  member,
  onClose,
}: {
  tenant: string
  member?: MemberWithUser | null
  onClose: () => void
}) {
  const isEdit = Boolean(member)
  const [values, setValues] = useState<MemberFormValues>(() => toFormValues(member))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const createMember = useCreateMember(tenant)
  const updateMember = useUpdateMember(tenant)

  const pending = isEdit ? updateMember.isPending : createMember.isPending

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const schema = isEdit ? memberUpdateSchema : memberWithUserInsertSchema
    const result = schema.safeParse(values)

    if (!result.success) {
      setErrors(fieldErrors(result.error))
      return
    }
    setErrors({})

    if (isEdit && member) {
      updateMember.mutate(
        { id: member.id, input: result.data },
        {
          onSuccess: () => {
            toast.success(`${values.user.name} updated`)
            onClose()
          },
          onError: (error) => toast.error(error.message),
        }
      )
      return
    }

    createMember.mutate(result.data as z.infer<typeof memberWithUserInsertSchema>, {
      onSuccess: (created) => {
        toast.success(`${created.user.name} added`)
        onClose()
      },
      onError: (error) => toast.error(error.message),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <SheetHeader>
        <FormSheetHeader
          icon={UserRound}
          title={isEdit ? "Edit member" : "Add member"}
          description={
            isEdit
              ? "Update this member's profile."
              : "Creates a user account and adds them as a member."
          }
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <FormSection icon={UserRound} title="Basic information">
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              <AvatarImage src={values.user.image || undefined} alt="" />
              <AvatarFallback className="bg-muted text-sm font-medium text-muted-foreground">
                {values.user.name ? initials(values.user.name) : <UserRound className="size-5" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <ImageUpload
                shape="circle"
                folder="members/avatars"
                value={values.user.image || null}
                onChange={(url) =>
                  setValues((v) => ({ ...v, user: { ...v.user, image: url ?? "" } }))
                }
                disabled={pending}
              />
            </div>
          </div>

          <Field data-invalid={Boolean(errors["user.name"])}>
            <FieldLabel htmlFor="member-name">
              Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="member-name"
              placeholder="Jane Doe"
              value={values.user.name}
              aria-invalid={Boolean(errors["user.name"])}
              onChange={(e) =>
                setValues((v) => ({ ...v, user: { ...v.user, name: e.target.value } }))
              }
            />
            <FieldError>{errors["user.name"]}</FieldError>
          </Field>

          <Field data-invalid={Boolean(errors["user.email"])}>
            <FieldLabel htmlFor="member-email">Email</FieldLabel>
            <Input
              id="member-email"
              type="email"
              placeholder="jane@example.com (optional)"
              value={values.user.email ?? ""}
              aria-invalid={Boolean(errors["user.email"])}
              onChange={(e) =>
                setValues((v) => ({ ...v, user: { ...v.user, email: e.target.value } }))
              }
            />
            <FieldError>{errors["user.email"]}</FieldError>
          </Field>

          <Field data-invalid={Boolean(errors["member.phone"])}>
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
                value={values.member.phone}
                aria-invalid={Boolean(errors["member.phone"])}
                onChange={(e) =>
                  setValues((v) => ({ ...v, member: { ...v.member, phone: e.target.value } }))
                }
              />
            </InputGroup>
            <FieldError>{errors["member.phone"]}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="member-status">Status</FieldLabel>
            <Select
              value={values.member.status}
              onValueChange={(value) =>
                setValues((v) => ({
                  ...v,
                  member: { ...v.member, status: value as MemberFieldValues["status"] },
                }))
              }
            >
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
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="member-dob">Date of Birth</FieldLabel>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      id="member-dob"
                      type="button"
                      variant="outline"
                      className="w-full justify-start font-normal data-[empty=true]:text-muted-foreground"
                      data-empty={!values.member.dateOfBirth}
                    />
                  }
                >
                  <CalendarIcon className="size-4" />
                  {values.member.dateOfBirth
                    ? new Date(`${values.member.dateOfBirth}T00:00:00`).toLocaleDateString(
                        undefined,
                        { day: "numeric", month: "short", year: "numeric" }
                      )
                    : "Pick a date"}
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    startMonth={new Date(1940, 0)}
                    endMonth={new Date()}
                    disabled={{ after: new Date() }}
                    selected={
                      values.member.dateOfBirth
                        ? new Date(`${values.member.dateOfBirth}T00:00:00`)
                        : undefined
                    }
                    onSelect={(date) =>
                      setValues((v) => ({
                        ...v,
                        member: {
                          ...v.member,
                          dateOfBirth: date
                            ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
                            : "",
                        },
                      }))
                    }
                  />
                </PopoverContent>
              </Popover>
            </Field>

            <Field>
              <FieldLabel htmlFor="member-gender">Gender</FieldLabel>
              <Select
                value={values.member.gender ?? ""}
                onValueChange={(value) =>
                  setValues((v) => ({
                    ...v,
                    member: { ...v.member, gender: value as MemberFieldValues["gender"] },
                  }))
                }
              >
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
            </Field>
          </div>
        </FormSection>

        <FormSection icon={MapPin} title="Address">
          <Field>
            <FieldLabel htmlFor="member-address">Address</FieldLabel>
            <Input
              id="member-address"
              placeholder="Street, city, postcode"
              value={values.member.address ?? ""}
              onChange={(e) =>
                setValues((v) => ({ ...v, member: { ...v.member, address: e.target.value } }))
              }
            />
          </Field>
        </FormSection>
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
  )
}