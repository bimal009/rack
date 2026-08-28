"use client"

import { useState, type FormEvent } from "react"
import { Banknote, Info, LayoutGrid } from "lucide-react"

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
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "@repo/ui/components/ui/sheet"
import { Switch } from "@repo/ui/components/ui/switch"
import { Textarea } from "@repo/ui/components/ui/textarea"

import { FormSection, FormSheetHeader } from "@/features/tenant/components/form-section"

import { fieldErrors } from "../lib/validation"
import {
  areaTypeSchema,
  type AreaType,
  type AreaTypeInput,
} from "../lib/schema"

interface AreaTypeFormValues {
  name: string
  slug: string
  description: string
  sports: string
  availableForBooking: boolean
  pricePerHour: string
  maxPlayers: string
  maxConcurrentBookings: string
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function toFormValues(area?: AreaType | null): AreaTypeFormValues {
  if (!area) {
    return {
      name: "",
      slug: "",
      description: "",
      sports: "",
      availableForBooking: true,
      pricePerHour: "0",
      maxPlayers: "1",
      maxConcurrentBookings: "1",
    }
  }
  return {
    name: area.name,
    slug: area.slug,
    description: area.description ?? "",
    sports: area.sports ?? "",
    availableForBooking: area.availableForBooking,
    pricePerHour: String(area.pricePerHour),
    maxPlayers: String(area.maxPlayers),
    maxConcurrentBookings: String(area.maxConcurrentBookings),
  }
}

interface AreaTypeFormBodyProps {
  area?: AreaType | null
  onSubmit: (values: AreaTypeInput) => void
  onCancel: () => void
}

function AreaTypeFormBody({ area, onSubmit, onCancel }: AreaTypeFormBodyProps) {
  const [values, setValues] = useState<AreaTypeFormValues>(() =>
    toFormValues(area)
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [slugTouched, setSlugTouched] = useState(Boolean(area))
  const isEdit = Boolean(area)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const result = areaTypeSchema.safeParse({
      ...values,
      pricePerHour: Number(values.pricePerHour),
      maxPlayers: Number(values.maxPlayers),
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
          icon={LayoutGrid}
          title={isEdit ? "Edit area type" : "Add area type"}
          description="Define a bookable area, its pricing, and capacity."
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <FormSection icon={Info} title="Basic information">
          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={Boolean(errors.name)}>
              <FieldLabel htmlFor="area-name">
                Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="area-name"
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
              <FieldLabel htmlFor="area-slug">
                Slug <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="area-slug"
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
            <FieldLabel htmlFor="area-description">Description</FieldLabel>
            <Textarea
              id="area-description"
              value={values.description}
              onChange={(e) =>
                setValues((v) => ({ ...v, description: e.target.value }))
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="area-sports">Sports</FieldLabel>
            <Input
              id="area-sports"
              placeholder="Indoor Cycling, Strength Training..."
              value={values.sports}
              onChange={(e) =>
                setValues((v) => ({ ...v, sports: e.target.value }))
              }
            />
          </Field>
        </FormSection>

        <FormSection icon={Banknote} title="Booking & pricing">
          <Field orientation="horizontal">
            <Switch
              id="area-available"
              checked={values.availableForBooking}
              onCheckedChange={(checked) =>
                setValues((v) => ({ ...v, availableForBooking: checked }))
              }
            />
            <div>
              <FieldLabel htmlFor="area-available">
                Available for booking
              </FieldLabel>
              <FieldDescription>
                Areas of this type can be booked by members.
              </FieldDescription>
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="area-price">
                Default Price per Hour
              </FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>NPR</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="area-price"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="1"
                  value={values.pricePerHour}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, pricePerHour: e.target.value }))
                  }
                />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="area-max-players">
                Default Max Players
              </FieldLabel>
              <Input
                id="area-max-players"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                value={values.maxPlayers}
                onChange={(e) =>
                  setValues((v) => ({ ...v, maxPlayers: e.target.value }))
                }
              />
              <FieldDescription>
                Default number of players that can use areas of this type.
              </FieldDescription>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="area-max-bookings">
              Max Concurrent Bookings
            </FieldLabel>
            <Input
              id="area-max-bookings"
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
            <FieldDescription>
              How many bookings can share the same time slot for areas of
              this type (e.g. 3 for a small-group room). Defaults to 1
              (exclusive).
            </FieldDescription>
          </Field>
        </FormSection>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isEdit ? "Save changes" : "Add area type"}</Button>
      </SheetFooter>
    </form>
  )
}

interface AreaTypeFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  area?: AreaType | null
  onSubmit: (values: AreaTypeInput) => void
}

export function AreaTypeFormSheet({
  open,
  onOpenChange,
  area,
  onSubmit,
}: AreaTypeFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        {open && (
          <AreaTypeFormBody
            key={area?.id ?? "new"}
            area={area}
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
