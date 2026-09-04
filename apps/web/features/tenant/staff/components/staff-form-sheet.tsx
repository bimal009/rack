"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import {
  Briefcase,
  CalendarIcon,
  Dumbbell,
  IdCard,
  MapPin,
  Plus,
  UserRound,
  UserRoundCog,
} from "lucide-react"
import { toast } from "sonner"
import {
  payTypeEnumSchema,
  staffGenderEnumSchema,
  staffUpdateSchema,
  staffVisibilityEnumSchema,
  staffWithUserInsertSchema,
  type GymRole,
  type PayType,
  type StaffGender,
  type StaffVisibility,
  type StaffWithUser,
} from "@repo/types"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar"
import { Button } from "@repo/ui/components/ui/button"
import { Calendar } from "@repo/ui/components/ui/calendar"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@repo/ui/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover"
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
import { ImageUpload } from "@/features/media"

import { useInstructorTypesQuery } from "@/features/tenant/settings/types/hooks/use-instructor-types"

import {
  useCreateStaffMutation,
  useUpdateStaffMutation,
} from "../hooks/use-staff"
import { GYM_ROLE_LABELS } from "../lib/roles"
import { fieldErrors } from "../lib/validation"

const GYM_ROLES = ["admin", "manager", "instructor", "frontdesk"] as const

interface StaffFormValues {
  image: string
  isActive: boolean
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
  instructorTypeId: string
  experience: string
  certifications: string
  canBeBooked: boolean
  visibility: StaffVisibility
  maxConcurrentBookings: string
}

function toFormValues(staff?: StaffWithUser | null): StaffFormValues {
  if (!staff) {
    return {
      image: "",
      isActive: true,
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
      instructorTypeId: "",
      experience: "",
      certifications: "",
      canBeBooked: false,
      visibility: "Public",
      maxConcurrentBookings: "1",
    }
  }

  const [firstName = "", ...rest] = staff.user.name.trim().split(/\s+/)

  return {
    image: staff.user.image ?? "",
    isActive: staff.isActive,
    firstName,
    lastName: rest.join(" "),
    email: staff.user.email,
    phone: staff.phone ?? "",
    dateOfBirth: staff.dateOfBirth ?? "",
    gender: staff.gender ?? "",
    address: staff.address ?? "",
    role: staff.role,
    payType: staff.payType ?? "",
    payRate: staff.payRate != null ? String(staff.payRate) : "",
    instructorTypeId: staff.instructorTypeId ?? "",
    experience: staff.experience != null ? String(staff.experience) : "",
    certifications: staff.certifications ?? "",
    canBeBooked: staff.canBeBooked,
    visibility: staff.visibility,
    maxConcurrentBookings: String(staff.maxConcurrentBookings),
  }
}

interface StaffFormSheetProps {
  tenant: string
  open: boolean
  onOpenChange: (open: boolean) => void
  staff?: StaffWithUser | null
}

export function StaffFormSheet({
  tenant,
  open,
  onOpenChange,
  staff,
}: StaffFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        {open && (
          <StaffForm
            key={staff?.id ?? "new"}
            tenant={tenant}
            staff={staff}
            onClose={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}

function StaffForm({
  tenant,
  staff,
  onClose,
}: {
  tenant: string
  staff?: StaffWithUser | null
  onClose: () => void
}) {
  const isEdit = Boolean(staff)
  const [values, setValues] = useState<StaffFormValues>(() => toFormValues(staff))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const createStaff = useCreateStaffMutation(tenant)
  const updateStaff = useUpdateStaffMutation(tenant)
  const instructorTypes = useInstructorTypesQuery(tenant, { limit: 100 })

  const pending = isEdit ? updateStaff.isPending : createStaff.isPending
  const isInstructor = values.role === "instructor"

  function set<K extends keyof StaffFormValues>(key: K, value: StaffFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const shared = {
      isActive: values.isActive,
      role: values.role || undefined,
      phone: values.phone,
      dateOfBirth: values.dateOfBirth,
      gender: values.gender,
      address: values.address,
      payType: values.payType || undefined,
      payRate: Number(values.payRate),
      instructorTypeId: values.instructorTypeId || undefined,
      experience:
        values.experience.trim() === "" ? null : Number(values.experience),
      certifications: values.certifications,
      canBeBooked: values.canBeBooked,
      visibility: values.visibility,
      maxConcurrentBookings: Number(values.maxConcurrentBookings),
    }

    if (isEdit && staff) {
      const result = staffUpdateSchema.safeParse({
        ...shared,
        phone: values.phone || undefined,
      })
      if (!result.success) {
        setErrors(fieldErrors(result.error))
        return
      }

      setErrors({})
      updateStaff.mutate(
        { id: staff.id, input: result.data },
        {
          onSuccess: () => {
            toast.success(`${staff.user.name} updated`)
            onClose()
          },
          onError: (error) => toast.error(error.message),
        }
      )
      return
    }

    const result = staffWithUserInsertSchema.safeParse({
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
          title={isEdit ? "Edit staff member" : "Add staff member"}
          description={
            isEdit
              ? "Update role, pay, and profile details for this member."
              : "Creates a user account and links it to this gym."
          }
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <FormSection icon={UserRound} title="Basic information">
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

          {isEdit && staff ? (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
              <Avatar size="sm">
                <AvatarImage src={staff.user.image ?? undefined} alt="" />
                <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
                  {staff.user.name
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase() ?? "")
                    .join("") || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {staff.user.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {staff.user.email}
                </p>
              </div>
            </div>
          ) : (
            <>
              <Field>
                <FieldLabel>Photo</FieldLabel>
                <ImageUpload
                  shape="circle"
                  folder="staff/avatars"
                  value={values.image || null}
                  onChange={(url) => set("image", url ?? "")}
                  disabled={pending}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field data-invalid={Boolean(errors.firstName)}>
                  <FieldLabel htmlFor="staff-first-name">
                    First Name <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="staff-first-name"
                    placeholder="Jane"
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
                    placeholder="Doe"
                    value={values.lastName}
                    aria-invalid={Boolean(errors.lastName)}
                    onChange={(e) => set("lastName", e.target.value)}
                  />
                  <FieldError>{errors.lastName}</FieldError>
                </Field>
              </div>

              <Field data-invalid={Boolean(errors.email)}>
                <FieldLabel htmlFor="staff-email">
                  Email <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="staff-email"
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

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="staff-dob">Date of Birth</FieldLabel>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      id="staff-dob"
                      type="button"
                      variant="outline"
                      className="w-full justify-start font-normal data-[empty=true]:text-muted-foreground"
                      data-empty={!values.dateOfBirth}
                    />
                  }
                >
                  <CalendarIcon className="size-4" />
                  {values.dateOfBirth
                    ? new Date(
                        `${values.dateOfBirth}T00:00:00`
                      ).toLocaleDateString(undefined, {
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
                    selected={
                      values.dateOfBirth
                        ? new Date(`${values.dateOfBirth}T00:00:00`)
                        : undefined
                    }
                    onSelect={(date) =>
                      set(
                        "dateOfBirth",
                        date
                          ? `${date.getFullYear()}-${String(
                              date.getMonth() + 1
                            ).padStart(2, "0")}-${String(date.getDate()).padStart(
                              2,
                              "0"
                            )}`
                          : ""
                      )
                    }
                  />
                </PopoverContent>
              </Popover>
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
              <Field data-invalid={Boolean(errors.instructorTypeId)}>
                <FieldLabel htmlFor="staff-instructor-type">
                  Instructor Type <span className="text-destructive">*</span>
                </FieldLabel>
                {instructorTypes.isSuccess &&
                instructorTypes.data.data.length === 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start font-normal text-muted-foreground"
                    onClick={() =>
                      router.push(
                        `/s/${tenant}/settings/types/instructor-types`
                      )
                    }
                  >
                    <Plus className="size-4" />
                    Add an instructor type
                  </Button>
                ) : (
                  <Select
                    value={values.instructorTypeId}
                    onValueChange={(value) => {
                      set("instructorTypeId", value ?? "")
                      const picked = instructorTypes.data?.data.find(
                        (t) => t.id === value
                      )
                      if (picked && !isEdit) {
                        set(
                          "maxConcurrentBookings",
                          String(picked.maxConcurrentBookings ?? 1)
                        )
                      }
                    }}
                  >
                    <SelectTrigger id="staff-instructor-type" className="w-full">
                      <SelectValue placeholder="Select a type">
                        {(value: string | null) =>
                          instructorTypes.data?.data.find((t) => t.id === value)
                            ?.name ?? "Select a type"
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {(instructorTypes.data?.data ?? []).map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FieldError>{errors.instructorTypeId}</FieldError>
              </Field>

              <Field data-invalid={Boolean(errors.experience)}>
                <FieldLabel htmlFor="staff-experience">
                  Experience (years) <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="staff-experience"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="1"
                  placeholder="5"
                  value={values.experience}
                  aria-invalid={Boolean(errors.experience)}
                  onChange={(e) => set("experience", e.target.value)}
                />
                <FieldError>{errors.experience}</FieldError>
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
                <FieldDescription>
                  Defaults from the instructor type — adjust for this person if
                  needed.
                </FieldDescription>
                <FieldError>{errors.maxConcurrentBookings}</FieldError>
              </Field>
            </div>
          </FormSection>
        )}
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? <Spinner /> : <IdCard className="size-4" />}
          {isEdit ? "Save changes" : "Add staff"}
        </Button>
      </SheetFooter>
    </form>
  )
}
