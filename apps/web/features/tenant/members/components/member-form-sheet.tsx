"use client"

import { useState, type FormEvent } from "react"
import { CalendarIcon, IdCard, MapPin, UserRound } from "lucide-react"
import { toast } from "sonner"
import {
  memberGenderEnumSchema,
  memberStatusEnumSchema,
  memberUpdateSchema,
  memberWithUserInsertSchema,
  type MemberGender,
  type MemberStatus,
  type MemberWithUser,
} from "@repo/types"

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar"
import { Button } from "@repo/ui/components/ui/button"
import { Calendar } from "@repo/ui/components/ui/calendar"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@repo/ui/components/ui/field"
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

interface MemberFormValues {
  image: string
  status: MemberStatus
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: MemberGender | ""
  address: string
}

function toFormValues(member?: MemberWithUser | null): MemberFormValues {
  if (!member) {
    return {
      image: "",
      status: "Active",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: "",
    }
  }

  const [firstName = "", ...rest] = member.user.name.trim().split(/\s+/)

  return {
    image: member.user.image ?? "",
    status: member.status,
    firstName,
    lastName: rest.join(" "),
    email: member.user.email,
    phone: member.phone ?? "",
    dateOfBirth: member.dateOfBirth ?? "",
    gender: member.gender ?? "",
    address: member.address ?? "",
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

  function set<K extends keyof MemberFormValues>(key: K, value: MemberFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const shared = {
      status: values.status,
      phone: values.phone,
      dateOfBirth: values.dateOfBirth,
      gender: values.gender,
      address: values.address,
    }

    if (isEdit && member) {
      const result = memberUpdateSchema.safeParse({
        ...shared,
        phone: values.phone || undefined,
      })
      if (!result.success) {
        setErrors(fieldErrors(result.error))
        return
      }

      setErrors({})
      updateMember.mutate(
        { id: member.id, input: result.data },
        {
          onSuccess: () => {
            toast.success(`${member.user.name} updated`)
            onClose()
          },
          onError: (error) => toast.error(error.message),
        }
      )
      return
    }

    const result = memberWithUserInsertSchema.safeParse({
      ...shared,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      image: values.image || undefined,
    })

    if (!result.success) {
      setErrors(fieldErrors(result.error))
      return
    }

    setErrors({})
    createMember.mutate(result.data, {
      onSuccess: () => {
        toast.success(`${result.data.firstName} ${result.data.lastName} added`)
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
          <Field>
            <FieldLabel htmlFor="member-status">Status</FieldLabel>
            <Select
              value={values.status}
              onValueChange={(value) => set("status", value as MemberStatus)}
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

          {isEdit && member ? (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
              <Avatar size="sm">
                <AvatarImage src={member.user.image ?? undefined} alt="" />
                <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
                  {initials(member.user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {member.user.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {member.user.email}
                </p>
              </div>
            </div>
          ) : (
            <>
              <Field>
                <FieldLabel>Photo</FieldLabel>
                <ImageUpload
                  shape="circle"
                  folder="members/avatars"
                  value={values.image || null}
                  onChange={(url) => set("image", url ?? "")}
                  disabled={pending}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field data-invalid={Boolean(errors.firstName)}>
                  <FieldLabel htmlFor="member-first-name">
                    First Name <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="member-first-name"
                    placeholder="Jane"
                    value={values.firstName}
                    aria-invalid={Boolean(errors.firstName)}
                    onChange={(e) => set("firstName", e.target.value)}
                  />
                  <FieldError>{errors.firstName}</FieldError>
                </Field>

                <Field data-invalid={Boolean(errors.lastName)}>
                  <FieldLabel htmlFor="member-last-name">
                    Last Name <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="member-last-name"
                    placeholder="Doe"
                    value={values.lastName}
                    aria-invalid={Boolean(errors.lastName)}
                    onChange={(e) => set("lastName", e.target.value)}
                  />
                  <FieldError>{errors.lastName}</FieldError>
                </Field>
              </div>

              <Field data-invalid={Boolean(errors.email)}>
                <FieldLabel htmlFor="member-email">
                  Email <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="member-email"
                  type="email"
                  placeholder="jane@example.com"
                  value={values.email}
                  aria-invalid={Boolean(errors.email)}
                  onChange={(e) => set("email", e.target.value)}
                />
                <FieldError>{errors.email}</FieldError>
              </Field>
            </>
          )}

          <Field data-invalid={Boolean(errors.phone)}>
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
                value={values.phone}
                aria-invalid={Boolean(errors.phone)}
                onChange={(e) => set("phone", e.target.value)}
              />
            </InputGroup>
            <FieldError>{errors.phone}</FieldError>
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
                      data-empty={!values.dateOfBirth}
                    />
                  }
                >
                  <CalendarIcon className="size-4" />
                  {values.dateOfBirth
                    ? new Date(`${values.dateOfBirth}T00:00:00`).toLocaleDateString(
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
                      values.dateOfBirth
                        ? new Date(`${values.dateOfBirth}T00:00:00`)
                        : undefined
                    }
                    onSelect={(date) =>
                      set(
                        "dateOfBirth",
                        date
                          ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
                          : ""
                      )
                    }
                  />
                </PopoverContent>
              </Popover>
            </Field>

            <Field>
              <FieldLabel htmlFor="member-gender">Gender</FieldLabel>
              <Select
                value={values.gender}
                onValueChange={(value) => set("gender", value as MemberGender)}
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
              value={values.address}
              onChange={(e) => set("address", e.target.value)}
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
