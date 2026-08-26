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
import { Textarea } from "@repo/ui/components/ui/textarea"

import { fieldErrors } from "../lib/validation"
import {
  instructorTypeSchema,
  revenueAccounts,
  type InstructorTypeInput,
  type InstructorTypeRecord,
} from "../lib/schema"

interface InstructorTypeFormValues {
  name: string
  slug: string
  description: string
  maxConcurrentBookings: string
  revenueAccount: string
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function toFormValues(
  type?: InstructorTypeRecord | null
): InstructorTypeFormValues {
  if (!type) {
    return {
      name: "",
      slug: "",
      description: "",
      maxConcurrentBookings: "1",
      revenueAccount: "",
    }
  }
  return {
    name: type.name,
    slug: type.slug,
    description: type.description ?? "",
    maxConcurrentBookings: String(type.maxConcurrentBookings),
    revenueAccount: type.revenueAccount ?? "",
  }
}

interface InstructorTypeFormBodyProps {
  type?: InstructorTypeRecord | null
  onSubmit: (values: InstructorTypeInput) => void
  onCancel: () => void
}

function InstructorTypeFormBody({
  type,
  onSubmit,
  onCancel,
}: InstructorTypeFormBodyProps) {
  const [values, setValues] = useState<InstructorTypeFormValues>(() =>
    toFormValues(type)
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [slugTouched, setSlugTouched] = useState(Boolean(type))
  const isEdit = Boolean(type)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const result = instructorTypeSchema.safeParse({
      ...values,
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
        <SheetTitle>
          {isEdit ? "Edit Instructor Type" : "Add Instructor Type"}
        </SheetTitle>
        <SheetDescription>
          Define a role instructors can be assigned, like Personal Trainer.
        </SheetDescription>
      </SheetHeader>

      <SheetBody className="flex flex-col gap-6">
        <FieldSet>
          <FieldGroup>
            <Field data-invalid={Boolean(errors.name)}>
              <FieldLabel htmlFor="inst-type-name">
                Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="inst-type-name"
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
              <FieldLabel htmlFor="inst-type-slug">
                Slug <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="inst-type-slug"
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

            <Field>
              <FieldLabel htmlFor="inst-type-description">
                Description
              </FieldLabel>
              <Textarea
                id="inst-type-description"
                value={values.description}
                onChange={(e) =>
                  setValues((v) => ({ ...v, description: e.target.value }))
                }
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="inst-type-max-bookings">
                  Max Concurrent Bookings
                </FieldLabel>
                <Input
                  id="inst-type-max-bookings"
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

              <Field>
                <FieldLabel htmlFor="inst-type-revenue-account">
                  Revenue Account
                </FieldLabel>
                <Select
                  value={values.revenueAccount}
                  onValueChange={(value) =>
                    setValues((v) => ({ ...v, revenueAccount: value ?? "" }))
                  }
                >
                  <SelectTrigger
                    id="inst-type-revenue-account"
                    className="w-full"
                  >
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {revenueAccounts.map((account) => (
                      <SelectItem key={account} value={account}>
                        {account}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <FieldDescription>
              How many bookings an instructor of this type can hold in the
              same time slot (e.g. 3 for a personal trainer with small
              groups). Defaults to 1.
            </FieldDescription>
          </FieldGroup>
        </FieldSet>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEdit ? "Save changes" : "Add instructor type"}
        </Button>
      </SheetFooter>
    </form>
  )
}

interface InstructorTypeFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type?: InstructorTypeRecord | null
  onSubmit: (values: InstructorTypeInput) => void
}

export function InstructorTypeFormSheet({
  open,
  onOpenChange,
  type,
  onSubmit,
}: InstructorTypeFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        {open && (
          <InstructorTypeFormBody
            key={type?.id ?? "new"}
            type={type}
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
