"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { IdCard, Save } from "lucide-react"
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
import { Spinner } from "@repo/ui/components/ui/spinner"
import { Textarea } from "@repo/ui/components/ui/textarea"

import { FormSection, FormSheetHeader } from "@/features/tenant/components/form-section"

function toFormValues(type?: InstructorTypeRecord | null): NewInstructorType {
  return {
    name: type?.name ?? "",
    description: type?.description ?? undefined,
    maxConcurrentBookings: type?.maxConcurrentBookings ?? 1,
  }
}

interface FormBodyProps {
  type?: InstructorTypeRecord | null
  pending?: boolean
  onSubmit: (values: NewInstructorType) => void
  onCancel: () => void
}

function FormBody({ type, pending, onSubmit, onCancel }: FormBodyProps) {
  const form = useForm<NewInstructorType>({
    resolver: zodResolver(instructorTypeInsertSchema),
    defaultValues: toFormValues(type),
  })
  const isEdit = Boolean(type)

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col" noValidate>
      <SheetHeader>
        <FormSheetHeader
          icon={IdCard}
          title={isEdit ? "Edit instructor type" : "Add instructor type"}
          description="Define a role instructors can be assigned, like Personal Trainer."
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <FormSection icon={IdCard} title="Details">
          <Field data-invalid={Boolean(form.formState.errors.name)}>
            <FieldLabel htmlFor="inst-type-name">
              Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="inst-type-name"
              placeholder="Personal Trainer"
              aria-invalid={Boolean(form.formState.errors.name)}
              {...form.register("name")}
            />
            <FieldError>{form.formState.errors.name?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="inst-type-description">Description</FieldLabel>
            <Textarea
              id="inst-type-description"
              placeholder="What this instructor type covers"
              {...form.register("description", { setValueAs: (value: string) => value || undefined })}
            />
          </Field>

          <Field data-invalid={Boolean(form.formState.errors.maxConcurrentBookings)}>
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
              aria-invalid={Boolean(form.formState.errors.maxConcurrentBookings)}
              {...form.register("maxConcurrentBookings", { valueAsNumber: true })}
            />
            <FieldDescription>
              How many bookings an instructor of this type can hold in the same
              time slot. Defaults to 1.
            </FieldDescription>
            <FieldError>{form.formState.errors.maxConcurrentBookings?.message}</FieldError>
          </Field>
        </FormSection>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? <Spinner /> : <Save className="size-4" />}
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
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
