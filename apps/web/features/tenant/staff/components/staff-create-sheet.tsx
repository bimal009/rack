"use client"

import { useState, type FormEvent } from "react"
import {
  Briefcase,
  Dumbbell,
  IdCard,
  MapPin,
  ShieldCheck,
  UserRound,
  UserRoundCog,
} from "lucide-react"
import { toast } from "sonner"
import {
  instructorTypeEnumSchema,
  payTypeEnumSchema,
  staffGenderEnumSchema,
  staffVisibilityEnumSchema,
  staffWithUserInsertSchema,
  type GymRole,
  type InstructorType,
  type PayType,
  type StaffGender,
  type StaffVisibility,
} from "@repo/types"

import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar"
import { Button } from "@repo/ui/components/ui/button"
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
import { Switch } from "@repo/ui/components/ui/switch"

import { FormSection, FormSheetHeader } from "@/features/tenant/components/form-section"

import { useCreateStaffMutation } from "../hooks/use-staff"
import { GYM_ROLE_LABELS } from "../lib/roles"
import { fieldErrors } from "../lib/validation"

const GYM_ROLES = ["admin", "manager", "instructor", "frontdesk"] as const

interface StaffFormValues {
  isActive: boolean
  allowAdminAccess: boolean
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: StaffGender | ""
  address: string
  role: GymRole | ""
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

const emptyForm: StaffFormValues = {
  isActive: true,
  allowAdminAccess: false,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  role: "",
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

function initials(firstName: string, lastName: string) {
  return ((firstName[0] ?? "") + (lastName[0] ?? "")).toUpperCase() || "?"
}

interface StaffCreateSheetProps {
  tenant: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StaffCreateSheet({
  tenant,
  open,
  onOpenChange,
}: StaffCreateSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        {open && (
          <StaffCreateForm tenant={tenant} onClose={() => onOpenChange(false)} />
        )}
      </SheetContent>
    </Sheet>
  )
}

function StaffCreateForm({
  tenant,
  onClose,
}: {
  tenant: string
  onClose: () => void
}) {
  const [values, setValues] = useState<StaffFormValues>(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const createStaff = useCreateStaffMutation(tenant)

  const isInstructor = values.role === "instructor"

  function set<K extends keyof StaffFormValues>(key: K, value: StaffFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const result = staffWithUserInsertSchema.safeParse({
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
    createStaff.mutate(result.data, {
      onSuccess: () => {
        toast.success(
          `${result.data.firstName} ${result.data.lastName} added to staff`
        )
        onClose()
      },
      onError: (error) => toast.error(error.message),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <SheetHeader>
        <FormSheetHeader
          icon={UserRoundCog}
          title="Add staff member"
          description="Creates a user account and links it to this gym."
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <FormSection
          icon={ShieldCheck}
          title="Portal access"
          description="Controls whether this person can sign in."
        >
          <Field orientation="horizontal">
            <Switch
              id="staff-active"
              checked={values.isActive}
              onCheckedChange={(checked) => set("isActive", checked)}
            />
            <div>
              <FieldLabel htmlFor="staff-active">Active staff member</FieldLabel>
              <FieldDescription>
                Inactive members stay on record but are hidden from most views.
              </FieldDescription>
            </div>
          </Field>

          <Field orientation="horizontal">
            <Switch
              id="staff-admin-access"
              checked={values.allowAdminAccess}
              onCheckedChange={(checked) => set("allowAdminAccess", checked)}
            />
            <div>
              <FieldLabel htmlFor="staff-admin-access">
                Allow admin portal access
              </FieldLabel>
              <FieldDescription>
                Off keeps them as a bookable resource only, with no login.
              </FieldDescription>
            </div>
          </Field>
        </FormSection>

        <FormSection icon={UserRound} title="Basic information">
          <Avatar className="size-16">
            <AvatarFallback className="bg-muted text-sm font-medium text-muted-foreground">
              {initials(values.firstName, values.lastName)}
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
                onChange={(e) => set("firstName", e.target.value)}
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
                onChange={(e) => set("lastName", e.target.value)}
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
                onChange={(e) => set("email", e.target.value)}
              />
              <FieldError>{errors.email}</FieldError>
            </Field>

            <Field data-invalid={Boolean(errors.phone)}>
              <FieldLabel htmlFor="staff-phone">
                Phone <span className="text-destructive">*</span>
              </FieldLabel>
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
                  onChange={(e) => set("phone", e.target.value)}
                />
              </InputGroup>
              <FieldError>{errors.phone}</FieldError>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="staff-dob">Date of Birth</FieldLabel>
              <Input
                id="staff-dob"
                type="date"
                value={values.dateOfBirth}
                onChange={(e) => set("dateOfBirth", e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="staff-gender">Gender</FieldLabel>
              <Select
                value={values.gender}
                onValueChange={(value) => set("gender", value as StaffGender)}
              >
                <SelectTrigger id="staff-gender" className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {staffGenderEnumSchema.options.map((gender) => (
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
            <FieldLabel htmlFor="staff-address">Address</FieldLabel>
            <Input
              id="staff-address"
              placeholder="Street, city, postcode"
              value={values.address}
              onChange={(e) => set("address", e.target.value)}
            />
          </Field>
        </FormSection>

        <FormSection icon={Briefcase} title="Role & pay">
          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={Boolean(errors.role)}>
              <FieldLabel htmlFor="staff-role">
                Role <span className="text-destructive">*</span>
              </FieldLabel>
              <Select
                value={values.role}
                onValueChange={(value) => set("role", value as GymRole)}
              >
                <SelectTrigger
                  id="staff-role"
                  className="w-full"
                  aria-invalid={Boolean(errors.role)}
                >
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {GYM_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {GYM_ROLE_LABELS[role]}
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
                onValueChange={(value) => set("payType", value as PayType)}
              >
                <SelectTrigger
                  id="staff-pay-type"
                  className="w-full"
                  aria-invalid={Boolean(errors.payType)}
                >
                  <SelectValue placeholder="Select pay type" />
                </SelectTrigger>
                <SelectContent>
                  {payTypeEnumSchema.options.map((type) => (
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
                onChange={(e) => set("payRate", e.target.value)}
              />
            </InputGroup>
            <FieldError>{errors.payRate}</FieldError>
          </Field>
        </FormSection>

        {isInstructor && (
          <FormSection
            icon={Dumbbell}
            title="Instructor profile"
            description="Shown on the schedule and booking pages."
          >
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="staff-display-name">Display name</FieldLabel>
                <Input
                  id="staff-display-name"
                  placeholder="Shown on the schedule"
                  value={values.displayName}
                  onChange={(e) => set("displayName", e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="staff-instructor-type">
                  Instructor Type
                </FieldLabel>
                <Select
                  value={values.instructorType}
                  onValueChange={(value) =>
                    set("instructorType", value as InstructorType)
                  }
                >
                  <SelectTrigger id="staff-instructor-type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {instructorTypeEnumSchema.options.map((type) => (
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
                  onChange={(e) => set("sports", e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="staff-experience">Experience</FieldLabel>
                <Input
                  id="staff-experience"
                  placeholder="5 years"
                  value={values.experience}
                  onChange={(e) => set("experience", e.target.value)}
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
                onChange={(e) => set("certifications", e.target.value)}
              />
            </Field>

            <Field orientation="horizontal">
              <Switch
                id="staff-can-be-booked"
                checked={values.canBeBooked}
                onCheckedChange={(checked) => set("canBeBooked", checked)}
              />
              <div>
                <FieldLabel htmlFor="staff-can-be-booked">Can be booked</FieldLabel>
                <FieldDescription>
                  Members can book one-to-one sessions with this instructor.
                </FieldDescription>
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="staff-visibility">Visibility</FieldLabel>
                <Select
                  value={values.visibility}
                  onValueChange={(value) =>
                    set("visibility", value as StaffVisibility)
                  }
                >
                  <SelectTrigger id="staff-visibility" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {staffVisibilityEnumSchema.options.map((option) => (
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
                    set("maxConcurrentBookings", e.target.value)
                  }
                />
                <FieldError>{errors.maxConcurrentBookings}</FieldError>
              </Field>
            </div>

            <Field orientation="horizontal">
              <Switch
                id="staff-active-instructor"
                checked={values.activeInstructor}
                onCheckedChange={(checked) => set("activeInstructor", checked)}
              />
              <div>
                <FieldLabel htmlFor="staff-active-instructor">
                  Active instructor
                </FieldLabel>
                <FieldDescription>
                  Inactive instructors stay on past bookings but cannot be
                  assigned.
                </FieldDescription>
              </div>
            </Field>
          </FormSection>
        )}
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={createStaff.isPending}>
          {createStaff.isPending ? <Spinner /> : <IdCard className="size-4" />}
          Add staff
        </Button>
      </SheetFooter>
    </form>
  )
}
