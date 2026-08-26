"use client"

import { useState, type FormEvent } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar"
import { Button } from "@repo/ui/components/ui/button"
import {
  Field,
  FieldDescription,
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
import { Switch } from "@repo/ui/components/ui/switch"

import { fieldErrors } from "../lib/validation"
import {
  instructorTypes,
  payTypes,
  staffGenders,
  staffRoles,
  staffSchema,
  staffVisibilities,
  type InstructorType,
  type PayType,
  type StaffGender,
  type StaffInput,
  type StaffMember,
  type StaffRole,
  type StaffVisibility,
} from "../lib/schema"
import { initials } from "./columns"

interface StaffFormValues {
  allowAdminAccess: boolean
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: StaffGender | ""
  address: string
  role: StaffRole | ""
  payType: PayType | ""
  payRate: string
  displayName: string
  instructorType: InstructorType
  sports: string
  experience: string
  certifications: string
  canBeBooked: boolean
  visibility: StaffVisibility
  maxConcurrentBookings: string
  activeInstructor: boolean
}

function toFormValues(
  staff?: StaffMember | null,
  defaultRole?: StaffRole
): StaffFormValues {
  if (!staff) {
    return {
      allowAdminAccess: false,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      role: defaultRole ?? "",
      payType: "",
      payRate: "",
      displayName: "",
      instructorType: "None",
      sports: "",
      experience: "",
      certifications: "",
      canBeBooked: false,
      visibility: "Public",
      maxConcurrentBookings: "1",
      activeInstructor: true,
    }
  }
  return {
    allowAdminAccess: staff.allowAdminAccess,
    firstName: staff.firstName,
    lastName: staff.lastName,
    email: staff.email,
    phone: staff.phone,
    dateOfBirth: staff.dateOfBirth ?? "",
    gender: staff.gender ?? "",
    address: staff.address ?? "",
    role: staff.role,
    payType: staff.payType,
    payRate: String(staff.payRate),
    displayName: staff.displayName ?? "",
    instructorType: staff.instructorType,
    sports: staff.sports ?? "",
    experience: staff.experience ?? "",
    certifications: staff.certifications ?? "",
    canBeBooked: staff.canBeBooked,
    visibility: staff.visibility,
    maxConcurrentBookings: String(staff.maxConcurrentBookings),
    activeInstructor: staff.activeInstructor,
  }
}

interface StaffFormBodyProps {
  staff?: StaffMember | null
  defaultRole?: StaffRole
  onSubmit: (values: StaffInput) => void
  onCancel: () => void
}

function StaffFormBody({
  staff,
  defaultRole,
  onSubmit,
  onCancel,
}: StaffFormBodyProps) {
  const [values, setValues] = useState<StaffFormValues>(() =>
    toFormValues(staff, defaultRole)
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = Boolean(staff)
  const isInstructor = values.role === "Instructor"

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const result = staffSchema.safeParse({
      ...values,
      role: values.role || undefined,
      payType: values.payType || undefined,
      payRate: Number(values.payRate),
      maxConcurrentBookings: Number(values.maxConcurrentBookings),
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
        <SheetTitle>{isEdit ? "Edit staff" : "Add staff member"}</SheetTitle>
        <SheetDescription>
          {isEdit
            ? "Update this staff member's details and pay rate."
            : "Add an instructor, trainer, or other staff member."}
        </SheetDescription>
      </SheetHeader>

      <SheetBody className="flex flex-col gap-6">
        <FieldSet>
          <FieldLegend>User Information</FieldLegend>
          <FieldGroup>
            <Field orientation="horizontal">
              <Switch
                id="staff-admin-access"
                checked={values.allowAdminAccess}
                onCheckedChange={(checked) =>
                  setValues((v) => ({ ...v, allowAdminAccess: checked }))
                }
              />
              <div>
                <FieldLabel htmlFor="staff-admin-access">
                  Allow Admin Portal Access
                </FieldLabel>
                <FieldDescription>
                  Lets this person sign in to the admin dashboard. Off keeps
                  them as a bookable resource only (no login).
                </FieldDescription>
              </div>
            </Field>
          </FieldGroup>
        </FieldSet>

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
          <FieldLegend>Additional Information</FieldLegend>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="staff-dob">Date of Birth</FieldLabel>
                <Input
                  id="staff-dob"
                  type="date"
                  value={values.dateOfBirth}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, dateOfBirth: e.target.value }))
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="staff-gender">Gender</FieldLabel>
                <Select
                  value={values.gender}
                  onValueChange={(value) =>
                    setValues((v) => ({ ...v, gender: value as StaffGender }))
                  }
                >
                  <SelectTrigger id="staff-gender" className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffGenders.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Address</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="staff-address">Address</FieldLabel>
              <Input
                id="staff-address"
                placeholder="Street, city, postcode"
                value={values.address}
                onChange={(e) =>
                  setValues((v) => ({ ...v, address: e.target.value }))
                }
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Role & Pay</FieldLegend>
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
            </div>

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
          </FieldGroup>
        </FieldSet>

        {isInstructor && (
          <FieldSet>
            <FieldLegend>Instructor Information</FieldLegend>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="staff-display-name">
                    Display name
                  </FieldLabel>
                  <Input
                    id="staff-display-name"
                    placeholder="Shown on the schedule"
                    value={values.displayName}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, displayName: e.target.value }))
                    }
                  />
                  <FieldDescription>
                    Shown on the schedule instead of the full name.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="staff-instructor-type">
                    Instructor Type
                  </FieldLabel>
                  <Select
                    value={values.instructorType}
                    onValueChange={(value) =>
                      setValues((v) => ({
                        ...v,
                        instructorType: value as InstructorType,
                      }))
                    }
                  >
                    <SelectTrigger id="staff-instructor-type" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {instructorTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="staff-sports">Sports</FieldLabel>
                  <Input
                    id="staff-sports"
                    placeholder="Boxing, Yoga..."
                    value={values.sports}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, sports: e.target.value }))
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="staff-experience">Experience</FieldLabel>
                  <Input
                    id="staff-experience"
                    placeholder="5 years"
                    value={values.experience}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, experience: e.target.value }))
                    }
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="staff-certifications">
                  Certifications
                </FieldLabel>
                <Input
                  id="staff-certifications"
                  placeholder="NASM-CPT, Yoga Alliance 200hr..."
                  value={values.certifications}
                  onChange={(e) =>
                    setValues((v) => ({
                      ...v,
                      certifications: e.target.value,
                    }))
                  }
                />
              </Field>

              <Field orientation="horizontal">
                <Switch
                  id="staff-can-be-booked"
                  checked={values.canBeBooked}
                  onCheckedChange={(checked) =>
                    setValues((v) => ({ ...v, canBeBooked: checked }))
                  }
                />
                <div>
                  <FieldLabel htmlFor="staff-can-be-booked">
                    Can be Booked
                  </FieldLabel>
                  <FieldDescription>
                    Members can book one-to-one sessions with this instructor.
                  </FieldDescription>
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="staff-visibility">
                    Visibility
                  </FieldLabel>
                  <Select
                    value={values.visibility}
                    onValueChange={(value) =>
                      setValues((v) => ({
                        ...v,
                        visibility: value as StaffVisibility,
                      }))
                    }
                  >
                    <SelectTrigger id="staff-visibility" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {staffVisibilities.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Private keeps them bookable but hidden from members.
                  </FieldDescription>
                </Field>

                <Field data-invalid={Boolean(errors.maxConcurrentBookings)}>
                  <FieldLabel htmlFor="staff-max-bookings">
                    Max Concurrent Bookings
                  </FieldLabel>
                  <Input
                    id="staff-max-bookings"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    step="1"
                    value={values.maxConcurrentBookings}
                    aria-invalid={Boolean(errors.maxConcurrentBookings)}
                    onChange={(e) =>
                      setValues((v) => ({
                        ...v,
                        maxConcurrentBookings: e.target.value,
                      }))
                    }
                  />
                  <FieldError>{errors.maxConcurrentBookings}</FieldError>
                </Field>
              </div>

              <Field orientation="horizontal">
                <Switch
                  id="staff-active-instructor"
                  checked={values.activeInstructor}
                  onCheckedChange={(checked) =>
                    setValues((v) => ({ ...v, activeInstructor: checked }))
                  }
                />
                <div>
                  <FieldLabel htmlFor="staff-active-instructor">
                    Active Instructor
                  </FieldLabel>
                  <FieldDescription>
                    Inactive instructors stay on past bookings but cannot be
                    assigned.
                  </FieldDescription>
                </div>
              </Field>
            </FieldGroup>
          </FieldSet>
        )}
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
  defaultRole?: StaffRole
  onSubmit: (values: StaffInput) => void
}

export function StaffFormSheet({
  open,
  onOpenChange,
  staff,
  defaultRole,
  onSubmit,
}: StaffFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        {open && (
          <StaffFormBody
            key={staff?.id ?? "new"}
            staff={staff}
            defaultRole={defaultRole}
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
