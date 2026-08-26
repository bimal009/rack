"use client"

import { useState, type FormEvent } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar"
import { Button } from "@repo/ui/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
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
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@repo/ui/components/ui/sheet"

import { fieldErrors } from "../lib/validation"
import {
  payTypes,
  staffRoles,
  staffSchema,
  type PayType,
  type StaffInput,
  type StaffMember,
  type StaffRole,
} from "../lib/schema"
import { initials } from "./columns"

interface StaffFormValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: StaffRole | ""
  specialty: string
  payType: PayType | ""
  payRate: string
}

function toFormValues(staff?: StaffMember | null): StaffFormValues {
  if (!staff) {
    return {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "",
      specialty: "",
      payType: "",
      payRate: "",
    }
  }
  return {
    firstName: staff.firstName,
    lastName: staff.lastName,
    email: staff.email,
    phone: staff.phone,
    role: staff.role,
    specialty: staff.specialty ?? "",
    payType: staff.payType,
    payRate: String(staff.payRate),
  }
}

interface StaffFormBodyProps {
  staff?: StaffMember | null
  onSubmit: (values: StaffInput) => void
  onCancel: () => void
}

function StaffFormBody({ staff, onSubmit, onCancel }: StaffFormBodyProps) {
  const [values, setValues] = useState<StaffFormValues>(() =>
    toFormValues(staff)
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = Boolean(staff)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const result = staffSchema.safeParse({
      ...values,
      role: values.role || undefined,
      payType: values.payType || undefined,
      payRate: Number(values.payRate),
    })

    if (!result.success) {
      setErrors(fieldErrors(result.error))
      return
    }

    setErrors({})
    onSubmit(result.data)
  }

  const previewStaff = {
    firstName: values.firstName || "?",
    lastName: values.lastName || "",
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <SheetHeader>
        <SheetTitle>{isEdit ? "Edit staff" : "Add Staff"}</SheetTitle>
        <SheetDescription>
          {isEdit
            ? "Update this staff member's details and pay rate."
            : "Add an instructor, trainer, or other staff member."}
        </SheetDescription>
      </SheetHeader>

      <SheetBody className="flex flex-col gap-6">
        <FieldSet>
          <FieldLegend>Basic Information</FieldLegend>
          <FieldGroup>
            <Avatar className="size-16">
              <AvatarImage src={undefined} alt="" />
              <AvatarFallback className="bg-muted text-sm font-medium text-muted-foreground">
                {initials(previewStaff)}
              </AvatarFallback>
            </Avatar>

            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={Boolean(errors.firstName)}>
                <FieldLabel htmlFor="staff-first-name">
                  First Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="staff-first-name"
                  value={values.firstName}
                  aria-invalid={Boolean(errors.firstName)}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, firstName: e.target.value }))
                  }
                />
                <FieldError>{errors.firstName}</FieldError>
              </Field>

              <Field data-invalid={Boolean(errors.lastName)}>
                <FieldLabel htmlFor="staff-last-name">
                  Last Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="staff-last-name"
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
                <FieldLabel htmlFor="staff-email">
                  Email <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="staff-email"
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
                <FieldLabel htmlFor="staff-phone">Phone</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>+977</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="staff-phone"
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
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Role</FieldLegend>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={Boolean(errors.role)}>
                <FieldLabel htmlFor="staff-role">
                  Role <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  value={values.role}
                  onValueChange={(value) =>
                    setValues((v) => ({ ...v, role: value as StaffRole }))
                  }
                >
                  <SelectTrigger
                    id="staff-role"
                    className="w-full"
                    aria-invalid={Boolean(errors.role)}
                  >
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{errors.role}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="staff-specialty">
                  Specialty <span className="text-muted-foreground">(optional)</span>
                </FieldLabel>
                <Input
                  id="staff-specialty"
                  placeholder="Yoga, Strength Training..."
                  value={values.specialty}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, specialty: e.target.value }))
                  }
                />
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Pay</FieldLegend>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={Boolean(errors.payType)}>
                <FieldLabel htmlFor="staff-pay-type">
                  Pay Type <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  value={values.payType}
                  onValueChange={(value) =>
                    setValues((v) => ({ ...v, payType: value as PayType }))
                  }
                >
                  <SelectTrigger
                    id="staff-pay-type"
                    className="w-full"
                    aria-invalid={Boolean(errors.payType)}
                  >
                    <SelectValue placeholder="Select pay type" />
                  </SelectTrigger>
                  <SelectContent>
                    {payTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{errors.payType}</FieldError>
              </Field>

              <Field data-invalid={Boolean(errors.payRate)}>
                <FieldLabel htmlFor="staff-pay-rate">
                  Pay Rate <span className="text-destructive">*</span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>NPR</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="staff-pay-rate"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={values.payRate}
                    aria-invalid={Boolean(errors.payRate)}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, payRate: e.target.value }))
                    }
                  />
                </InputGroup>
                <FieldError>{errors.payRate}</FieldError>
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isEdit ? "Save changes" : "Add staff"}</Button>
      </SheetFooter>
    </form>
  )
}

interface StaffFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  staff?: StaffMember | null
  onSubmit: (values: StaffInput) => void
}

export function StaffFormSheet({
  open,
  onOpenChange,
  staff,
  onSubmit,
}: StaffFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        {open && (
          <StaffFormBody
            key={staff?.id ?? "new"}
            staff={staff}
            onSubmit={(values) => {
              onSubmit(values)
              onOpenChange(false)
            }}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
