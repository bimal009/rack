"use client"

import { useState, type FormEvent } from "react"

import { Button } from "@repo/ui/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSet,
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
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@repo/ui/components/ui/sheet"

import { fieldErrors } from "../lib/validation"
import { simpleTypeSchema, type SimpleType, type SimpleTypeInput } from "../lib/schema"

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

interface SimpleTypeFormValues {
  name: string
  slug: string
  rate: string
}

function toFormValues(item?: SimpleType | null): SimpleTypeFormValues {
  return {
    name: item?.name ?? "",
    slug: item?.slug ?? "",
    rate: item?.rate !== undefined ? String(item.rate) : "",
  }
}

interface SimpleTypeFormBodyProps {
  label: string
  hasSlug: boolean
  hasRate: boolean
  item?: SimpleType | null
  onSubmit: (values: SimpleTypeInput) => void
  onCancel: () => void
}

function SimpleTypeFormBody({
  label,
  hasSlug,
  hasRate,
  item,
  onSubmit,
  onCancel,
}: SimpleTypeFormBodyProps) {
  const [values, setValues] = useState<SimpleTypeFormValues>(() =>
    toFormValues(item)
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [slugTouched, setSlugTouched] = useState(Boolean(item))
  const isEdit = Boolean(item)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const result = simpleTypeSchema.safeParse({
      name: values.name,
      slug: hasSlug ? values.slug : undefined,
      rate: hasRate ? Number(values.rate) : undefined,
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
          {isEdit ? `Edit ${label}` : `Add ${label}`}
        </SheetTitle>
        <SheetDescription>
          {isEdit
            ? `Update this ${label.toLowerCase()}.`
            : `Add a new ${label.toLowerCase()} for your gym.`}
        </SheetDescription>
      </SheetHeader>

      <SheetBody className="flex flex-col gap-6">
        <FieldSet>
          <FieldGroup>
            <Field data-invalid={Boolean(errors.name)}>
              <FieldLabel htmlFor="simple-type-name">
                Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="simple-type-name"
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

            {hasSlug && (
              <Field data-invalid={Boolean(errors.slug)}>
                <FieldLabel htmlFor="simple-type-slug">Slug</FieldLabel>
                <Input
                  id="simple-type-slug"
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
            )}

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
                    value={values.rate}
                    aria-invalid={Boolean(errors.rate)}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, rate: e.target.value }))
                    }
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>%</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldError>{errors.rate}</FieldError>
              </Field>
            )}
          </FieldGroup>
        </FieldSet>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isEdit ? "Save changes" : `Add ${label.toLowerCase()}`}</Button>
      </SheetFooter>
    </form>
  )
}

interface SimpleTypeFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  label: string
  hasSlug: boolean
  hasRate: boolean
  item?: SimpleType | null
  onSubmit: (values: SimpleTypeInput) => void
}

export function SimpleTypeFormSheet({
  open,
  onOpenChange,
  label,
  hasSlug,
  hasRate,
  item,
  onSubmit,
}: SimpleTypeFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        {open && (
          <SimpleTypeFormBody
            key={item?.id ?? "new"}
            label={label}
            hasSlug={hasSlug}
            hasRate={hasRate}
            item={item}
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
