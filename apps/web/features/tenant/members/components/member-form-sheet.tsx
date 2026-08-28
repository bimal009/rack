"use client"

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react"
import { Camera, CreditCard, MapPin, Plus, Trash2, UserRound, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar"
import { Button } from "@repo/ui/components/ui/button"
import {
  Field,
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

import { FormSection, FormSheetHeader } from "@/features/tenant/components/form-section"
import { initialPlans } from "@/features/tenant/revenue/plans/lib/data"

import { fieldErrors } from "../lib/validation"
import {
  genders,
  memberSchema,
  type Gender,
  type Member,
  type MemberInput,
  type Membership,
} from "../lib/schema"
import { initials } from "./columns"

interface MemberFormValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: Gender | ""
  address: string
  memberships: Membership[]
}

function toFormValues(member?: Member | null): MemberFormValues {
  if (!member) {
    return {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      memberships: [],
    }
  }
  return {
    firstName: member.firstName,
    lastName: member.lastName,
    email: member.email,
    phone: member.phone,
    dateOfBirth: member.dateOfBirth ?? "",
    gender: member.gender ?? "",
    address: member.address ?? "",
    memberships: member.memberships,
  }
}

interface AvatarPreview {
  url: string
}

interface MemberFormBodyProps {
  member?: Member | null
  onSubmit: (values: MemberInput, avatarUrl?: string) => void
  onCancel: () => void
}

function MemberFormBody({ member, onSubmit, onCancel }: MemberFormBodyProps) {
  const [values, setValues] = useState<MemberFormValues>(() =>
    toFormValues(member)
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [avatar, setAvatar] = useState<AvatarPreview | null>(
    member?.avatarUrl ? { url: member.avatarUrl } : null
  )
  const createdUrls = useRef<string[]>([])
  const isEdit = Boolean(member)

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      createdUrls.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  function handleAvatarSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    createdUrls.current.push(url)
    setAvatar({ url })
    event.target.value = ""
  }

  function addMembership() {
    setValues((v) => ({
      ...v,
      memberships: [...v.memberships, { planId: "", planName: "" }],
    }))
  }

  function updateMembership(index: number, patch: Partial<Membership>) {
    setValues((v) => ({
      ...v,
      memberships: v.memberships.map((m, i) =>
        i === index ? { ...m, ...patch } : m
      ),
    }))
  }

  function removeMembership(index: number) {
    setValues((v) => ({
      ...v,
      memberships: v.memberships.filter((_, i) => i !== index),
    }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const result = memberSchema.safeParse({
      ...values,
      gender: values.gender || undefined,
      memberships: values.memberships.filter((m) => m.planId),
    })

    if (!result.success) {
      setErrors(fieldErrors(result.error))
      return
    }

    setErrors({})
    onSubmit(result.data, avatar?.url)
  }

  const previewMember = {
    firstName: values.firstName || "?",
    lastName: values.lastName || "",
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <SheetHeader>
        <FormSheetHeader
          icon={Users}
          title={isEdit ? "Edit member" : "Add member"}
          description={
            isEdit
              ? "Update this member's profile and membership."
              : "Add a new member to your gym."
          }
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <FormSection icon={UserRound} title="Basic information">
          <div className="relative w-fit">
            <Avatar className="size-16">
              <AvatarImage src={avatar?.url} alt="" />
              <AvatarFallback className="bg-muted text-sm font-medium text-muted-foreground">
                {initials(previewMember)}
              </AvatarFallback>
            </Avatar>
            <label className="absolute -right-0.5 -bottom-0.5 flex size-6 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <Camera className="size-3.5" />
              <span className="sr-only">Upload photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarSelected}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={Boolean(errors.firstName)}>
              <FieldLabel htmlFor="member-first-name">
                First Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="member-first-name"
                value={values.firstName}
                aria-invalid={Boolean(errors.firstName)}
                onChange={(e) =>
                  setValues((v) => ({ ...v, firstName: e.target.value }))
                }
              />
              <FieldError>{errors.firstName}</FieldError>
            </Field>

            <Field data-invalid={Boolean(errors.lastName)}>
              <FieldLabel htmlFor="member-last-name">
                Last Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="member-last-name"
                value={values.lastName}
                aria-invalid={Boolean(errors.lastName)}
                onChange={(e) =>
                  setValues((v) => ({ ...v, lastName: e.target.value }))
                }
              />
              <FieldError>{errors.lastName}</FieldError>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={Boolean(errors.email)}>
              <FieldLabel htmlFor="member-email">
                Email <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="member-email"
                type="email"
                value={values.email}
                aria-invalid={Boolean(errors.email)}
                onChange={(e) =>
                  setValues((v) => ({ ...v, email: e.target.value }))
                }
              />
              <FieldError>{errors.email}</FieldError>
            </Field>

            <Field data-invalid={Boolean(errors.phone)}>
              <FieldLabel htmlFor="member-phone">Phone</FieldLabel>
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
                  onChange={(e) =>
                    setValues((v) => ({ ...v, phone: e.target.value }))
                  }
                />
              </InputGroup>
              <FieldError>{errors.phone}</FieldError>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="member-dob">Date of Birth</FieldLabel>
              <Input
                id="member-dob"
                type="date"
                value={values.dateOfBirth}
                onChange={(e) =>
                  setValues((v) => ({ ...v, dateOfBirth: e.target.value }))
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="member-gender">Gender</FieldLabel>
              <Select
                value={values.gender}
                onValueChange={(value) =>
                  setValues((v) => ({ ...v, gender: value as Gender }))
                }
              >
                <SelectTrigger id="member-gender" className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {genders.map((gender) => (
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
              onChange={(e) =>
                setValues((v) => ({ ...v, address: e.target.value }))
              }
            />
          </Field>
        </FormSection>

        <FormSection
          icon={CreditCard}
          title="Membership"
          description="Assign an existing plan to this member."
        >
          {values.memberships.length > 0 && (
            <div className="flex flex-col gap-2">
              {values.memberships.map((membership, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Select
                    value={membership.planId}
                    onValueChange={(planId) => {
                      const plan = initialPlans.find((p) => p.id === planId)
                      updateMembership(index, {
                        planId: planId ?? "",
                        planName: plan?.name ?? "",
                      })
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a plan">
                        {() => membership.planName || "Select a plan"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {initialPlans
                        .filter((plan) => plan.active)
                        .map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeMembership(index)}
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only">Remove membership</span>
                  </Button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={addMembership}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Plus className="size-3.5" />
            Add Membership
          </button>
        </FormSection>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEdit ? "Save changes" : "Add member"}
        </Button>
      </SheetFooter>
    </form>
  )
}

interface MemberFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member?: Member | null
  onSubmit: (values: MemberInput, avatarUrl?: string) => void
}

export function MemberFormSheet({
  open,
  onOpenChange,
  member,
  onSubmit,
}: MemberFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        {open && (
          <MemberFormBody
            key={member?.id ?? "new"}
            member={member}
            onSubmit={(values, avatarUrl) => {
              onSubmit(values, avatarUrl)
              onOpenChange(false)
            }}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
