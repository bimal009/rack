"use client"

import { useState, type FormEvent } from "react"
import type { LucideIcon } from "lucide-react"
import { z } from "zod"

import { Button } from "@repo/ui/components/ui/button"
import { Field, FieldError, FieldLabel } from "@repo/ui/components/ui/field"
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
  SheetFooter,
  SheetHeader,
} from "@repo/ui/components/ui/sheet"

import { FormSection, FormSheetHeader } from "@/features/tenant/components/form-section"

import { fieldErrors } from "../lib/validation"
import type { TypeRow, TypeInput } from "./type-list"

const schema = z.object({
  name: z.string().trim().min(1, "Enter a name").max(120),
  rate: z.number().min(0).max(100).optional(),
})

interface FormBodyProps {
  icon: LucideIcon
  label: string
  hasRate: boolean
  item?: TypeRow | null
  pending?: boolean
  onSubmit: (values: TypeInput) => void
  onCancel: () => void
}

function FormBody({
  icon,
  label,
  hasRate,
  item,
  pending,
  onSubmit,
  onCancel,
}: FormBodyProps) {
  const [name, setName] = useState(item?.name ?? "")
  const [rate, setRate] = useState(
    item?.rate !== undefined ? String(item.rate) : ""
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = Boolean(item)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const result = schema.safeParse({
      name,
      rate: hasRate ? Number(rate) : undefined,
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
          icon={icon}
          title={isEdit ? `Edit ${label}` : `Add ${label}`}
          description={
            isEdit
              ? `Update this ${label.toLowerCase()}.`
              : `Add a new ${label.toLowerCase()} for your gym.`
          }
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <FormSection icon={icon} title="Details">
          <Field data-invalid={Boolean(errors.name)}>
            <FieldLabel htmlFor="simple-type-name">
              Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="simple-type-name"
              value={name}
              aria-invalid={Boolean(errors.name)}
              onChange={(e) => setName(e.target.value)}
            />
            <FieldError>{errors.name}</FieldError>
          </Field>

          {hasRate && (
            <Field data-invalid={Boolean(errors.rate)}>
              <FieldLabel htmlFor="simple-type-rate">Rate</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="simple-type-rate"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="100"
                  step="0.1"
                  value={rate}
                  aria-invalid={Boolean(errors.rate)}
                  onChange={(e) => setRate(e.target.value)}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>%</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldError>{errors.rate}</FieldError>
            </Field>
          )}
        </FormSection>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {isEdit ? "Save changes" : `Add ${label.toLowerCase()}`}
        </Button>
      </SheetFooter>
    </form>
  )
}

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  icon: LucideIcon
  label: string
  hasRate: boolean
  item?: TypeRow | null
  pending?: boolean
  onSubmit: (values: TypeInput) => void
}

export function TypeFormSheet({
  open,
  onOpenChange,
  icon,
  label,
  hasRate,
  item,
  pending,
  onSubmit,
}: SheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        {open && (
          <FormBody
            key={item?.id ?? "new"}
            icon={icon}
            label={label}
            hasRate={hasRate}
            item={item}
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
