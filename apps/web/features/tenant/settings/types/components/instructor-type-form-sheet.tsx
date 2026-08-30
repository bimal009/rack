"use client"

import { useState, type FormEvent } from "react"
import { IdCard } from "lucide-react"
import type { InstructorTypeRecord, NewInstructorType } from "@repo/types"
import { instructorTypeInsertSchema } from "@repo/types"

import { Button } from "@repo/ui/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@repo/ui/components/ui/field"
import { Input } from "@repo/ui/components/ui/input"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "@repo/ui/components/ui/sheet"
import { Textarea } from "@repo/ui/components/ui/textarea"

import { FormSection, FormSheetHeader } from "@/features/tenant/components/form-section"

import { fieldErrors } from "../lib/validation"

interface FormValues {
  name: string
  description: string
  maxConcurrentBookings: string
}

function toFormValues(type?: InstructorTypeRecord | null): FormValues {
  return {
    name: type?.name ?? "",
    description: type?.description ?? "",
    maxConcurrentBookings: String(type?.maxConcurrentBookings ?? 1),
  }
}

interface FormBodyProps {
  type?: InstructorTypeRecord | null
  pending?: boolean
  onSubmit: (values: NewInstructorType) => void
  onCancel: () => void
}

function FormBody({ type, pending, onSubmit, onCancel }: FormBodyProps) {
  const [values, setValues] = useState<FormValues>(() => toFormValues(type))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = Boolean(type)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const result = instructorTypeInsertSchema.safeParse({
      name: values.name,
      description: values.description || undefined,
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
        <FormSheetHeader
          icon={IdCard}
          title={isEdit ? "Edit instructor type" : "Add instructor type"}
          description="Define a role instructors can be assigned, like Personal Trainer."
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <FormSection icon={IdCard} title="Details">
          <Field data-invalid={Boolean(errors.name)}>
            <FieldLabel htmlFor="inst-type-name">
              Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="inst-type-name"
              placeholder="Personal Trainer"
              value={values.name}
              aria-invalid={Boolean(errors.name)}
              onChange={(e) =>
                setValues((v) => ({ ...v, name: e.target.value }))
              }
            />
            <FieldError>{errors.name}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="inst-type-description">Description</FieldLabel>
            <Textarea
              id="inst-type-description"
              placeholder="What this instructor type covers"
              value={values.description}
              onChange={(e) =>
                setValues((v) => ({ ...v, description: e.target.value }))
              }
            />
          </Field>

          <Field data-invalid={Boolean(errors.maxConcurrentBookings)}>
            <FieldLabel htmlFor="inst-type-max-bookings">
              Max Concurrent Bookings
            </FieldLabel>
            <Input
              id="inst-type-max-bookings"
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              placeholder="1"
              value={values.maxConcurrentBookings}
              aria-invalid={Boolean(errors.maxConcurrentBookings)}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  maxConcurrentBookings: e.target.value,
                }))
              }
            />
            <FieldDescription>
              How many bookings an instructor of this type can hold in the same
              time slot. Defaults to 1.
            </FieldDescription>
            <FieldError>{errors.maxConcurrentBookings}</FieldError>
          </Field>
        </FormSection>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {isEdit ? "Save changes" : "Add instructor type"}
        </Button>
      </SheetFooter>
    </form>
  )
}

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type?: InstructorTypeRecord | null
  pending?: boolean
  onSubmit: (values: NewInstructorType) => void
}

export function InstructorTypeFormSheet({
  open,
  onOpenChange,
  type,
  pending,
  onSubmit,
}: SheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        {open && (
          <FormBody
            key={type?.id ?? "new"}
            type={type}
            pending={pending}
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
