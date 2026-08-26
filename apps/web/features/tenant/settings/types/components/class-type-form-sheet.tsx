"use client"

import { useState, type FormEvent } from "react"

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
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@repo/ui/components/ui/sheet"
import { Switch } from "@repo/ui/components/ui/switch"
import { Textarea } from "@repo/ui/components/ui/textarea"

import { fieldErrors } from "../lib/validation"
import {
  classTypeSchema,
  type ClassType,
  type ClassTypeInput,
} from "../lib/schema"

interface ClassTypeFormValues {
  name: string
  slug: string
  description: string
  sports: string
  availableForBooking: boolean
  pricePerClass: string
  maxParticipants: string
  maxConcurrentBookings: string
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function toFormValues(cls?: ClassType | null): ClassTypeFormValues {
  if (!cls) {
    return {
      name: "",
      slug: "",
      description: "",
      sports: "",
      availableForBooking: true,
      pricePerClass: "0",
      maxParticipants: "1",
      maxConcurrentBookings: "1",
    }
  }
  return {
    name: cls.name,
    slug: cls.slug,
    description: cls.description ?? "",
    sports: cls.sports ?? "",
    availableForBooking: cls.availableForBooking,
    pricePerClass: String(cls.pricePerClass),
    maxParticipants: String(cls.maxParticipants),
    maxConcurrentBookings: String(cls.maxConcurrentBookings),
  }
}

interface ClassTypeFormBodyProps {
  cls?: ClassType | null
  onSubmit: (values: ClassTypeInput) => void
  onCancel: () => void
}

function ClassTypeFormBody({ cls, onSubmit, onCancel }: ClassTypeFormBodyProps) {
  const [values, setValues] = useState<ClassTypeFormValues>(() =>
    toFormValues(cls)
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [slugTouched, setSlugTouched] = useState(Boolean(cls))
  const isEdit = Boolean(cls)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const result = classTypeSchema.safeParse({
      ...values,
      pricePerClass: Number(values.pricePerClass),
      maxParticipants: Number(values.maxParticipants),
      maxConcurrentBookings: Number(values.maxConcurrentBookings),
    })

    if (!result.success) {
      setErrors(fieldErrors(result.error))
      return
    }

    setErrors({})
    onSubmit(result.data)
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <SheetHeader>
        <SheetTitle>{isEdit ? "Edit Class Type" : "Add Class Type"}</SheetTitle>
        <SheetDescription>
          Define a class, its pricing, and capacity.
        </SheetDescription>
      </SheetHeader>

      <SheetBody className="flex flex-col gap-6">
        <FieldSet>
          <FieldLegend>Basic Information</FieldLegend>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={Boolean(errors.name)}>
                <FieldLabel htmlFor="class-name">
                  Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="class-name"
                  value={values.name}
                  aria-invalid={Boolean(errors.name)}
                  onChange={(e) => {
                    const name = e.target.value
                    setValues((v) => ({
                      ...v,
                      name,
                      slug: slugTouched ? v.slug : slugify(name),
                    }))
                  }}
                />
                <FieldError>{errors.name}</FieldError>
              </Field>

              <Field data-invalid={Boolean(errors.slug)}>
                <FieldLabel htmlFor="class-slug">
                  Slug <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="class-slug"
                  value={values.slug}
                  aria-invalid={Boolean(errors.slug)}
                  onChange={(e) => {
                    setSlugTouched(true)
                    setValues((v) => ({ ...v, slug: e.target.value }))
                  }}
                />
                <FieldDescription>
                  Lowercase letters, numbers, and hyphens only.
                </FieldDescription>
                <FieldError>{errors.slug}</FieldError>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="class-description">Description</FieldLabel>
              <Textarea
                id="class-description"
                value={values.description}
                onChange={(e) =>
                  setValues((v) => ({ ...v, description: e.target.value }))
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="class-sports">Sports</FieldLabel>
              <Input
                id="class-sports"
                placeholder="Yoga, CrossFit..."
                value={values.sports}
                onChange={(e) =>
                  setValues((v) => ({ ...v, sports: e.target.value }))
                }
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Booking & Pricing</FieldLegend>
          <FieldGroup>
            <Field orientation="horizontal">
              <Switch
                id="class-available"
                checked={values.availableForBooking}
                onCheckedChange={(checked) =>
                  setValues((v) => ({ ...v, availableForBooking: checked }))
                }
              />
              <div>
                <FieldLabel htmlFor="class-available">
                  Available for booking
                </FieldLabel>
                <FieldDescription>
                  Classes of this type can be booked by members.
                </FieldDescription>
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="class-price">
                  Default Price per Class
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>NPR</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="class-price"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={values.pricePerClass}
                    onChange={(e) =>
                      setValues((v) => ({
                        ...v,
                        pricePerClass: e.target.value,
                      }))
                    }
                  />
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel htmlFor="class-max-participants">
                  Default Max Participants
                </FieldLabel>
                <Input
                  id="class-max-participants"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  value={values.maxParticipants}
                  onChange={(e) =>
                    setValues((v) => ({
                      ...v,
                      maxParticipants: e.target.value,
                    }))
                  }
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="class-max-bookings">
                Max Concurrent Bookings
              </FieldLabel>
              <Input
                id="class-max-bookings"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                value={values.maxConcurrentBookings}
                onChange={(e) =>
                  setValues((v) => ({
                    ...v,
                    maxConcurrentBookings: e.target.value,
                  }))
                }
              />
            </Field>
          </FieldGroup>
        </FieldSet>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isEdit ? "Save changes" : "Add class type"}</Button>
      </SheetFooter>
    </form>
  )
}

interface ClassTypeFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cls?: ClassType | null
  onSubmit: (values: ClassTypeInput) => void
}

export function ClassTypeFormSheet({
  open,
  onOpenChange,
  cls,
  onSubmit,
}: ClassTypeFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        {open && (
          <ClassTypeFormBody
            key={cls?.id ?? "new"}
            cls={cls}
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
