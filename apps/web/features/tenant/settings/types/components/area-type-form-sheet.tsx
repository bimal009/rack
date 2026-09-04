"use client"

import { useState, type FormEvent } from "react"
import { useParams } from "next/navigation"
import { Banknote, Check, LayoutGrid, Save } from "lucide-react"
import { areaTypeInsertSchema } from "@repo/types"
import type { AreaType, NewAreaType } from "@repo/types"

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
import { Spinner } from "@repo/ui/components/ui/spinner"
import { Switch } from "@repo/ui/components/ui/switch"
import { Textarea } from "@repo/ui/components/ui/textarea"
import { cn } from "@repo/ui/lib/utils"

import { FormSection, FormSheetHeader } from "@/features/tenant/components/form-section"

import { useGymSportsQuery } from "../hooks/use-gym-sports"
import { fieldErrors } from "../lib/validation"

interface FormValues {
  name: string
  description: string
  sports: string[]
  availableForBooking: boolean
  pricePerHour: string
  maxPlayers: string
  maxConcurrentBookings: string
}

function toFormValues(area?: AreaType | null): FormValues {
  return {
    name: area?.name ?? "",
    description: area?.description ?? "",
    sports: area?.sports ?? [],
    availableForBooking: area?.availableForBooking ?? true,
    pricePerHour: String(area?.pricePerHour ?? 0),
    maxPlayers: String(area?.maxPlayers ?? 1),
    maxConcurrentBookings: String(area?.maxConcurrentBookings ?? 1),
  }
}

interface FormBodyProps {
  area?: AreaType | null
  pending?: boolean
  onSubmit: (values: NewAreaType) => void
  onCancel: () => void
}

function FormBody({ area, pending, onSubmit, onCancel }: FormBodyProps) {
  const tenant = useParams<{ tenant: string }>().tenant
  const sportsQuery = useGymSportsQuery(tenant)
  const [values, setValues] = useState<FormValues>(() => toFormValues(area))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = Boolean(area)

  function toggleSport(name: string) {
    setValues((v) => ({
      ...v,
      sports: v.sports.includes(name)
        ? v.sports.filter((s) => s !== name)
        : [...v.sports, name],
    }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const result = areaTypeInsertSchema.safeParse({
      name: values.name,
      description: values.description || undefined,
      sports: values.sports,
      availableForBooking: values.availableForBooking,
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
          description="A bookable space like a cycling studio or a strength floor."
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <FormSection icon={LayoutGrid} title="Details">
          <Field data-invalid={Boolean(errors.name)}>
            <FieldLabel htmlFor="area-name">
              Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="area-name"
              placeholder="Cycling Studio"
              value={values.name}
              aria-invalid={Boolean(errors.name)}
              onChange={(e) =>
                setValues((v) => ({ ...v, name: e.target.value }))
              }
            />
            <FieldError>{errors.name}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="area-description">Description</FieldLabel>
            <Textarea
              id="area-description"
              placeholder="A bookable space like a cycling studio or strength floor"
              value={values.description}
              onChange={(e) =>
                setValues((v) => ({ ...v, description: e.target.value }))
              }
            />
          </Field>

          <Field>
            <FieldLabel>Sports</FieldLabel>
            <div className="flex flex-wrap gap-1.5">
              {(sportsQuery.data?.data ?? []).map((sport) => {
                const selected = values.sports.includes(sport.name)
                return (
                  <button
                    key={sport.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleSport(sport.name)}
                    className={cn(
                      "flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-foreground hover:bg-muted/50"
                    )}
                  >
                    {selected && <Check className="size-3" />}
                    {sport.name}
                  </button>
                )
              })}
            </div>
            <FieldDescription>
              Pick from the sports you set up for your gym.
            </FieldDescription>
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
            <Field data-invalid={Boolean(errors.pricePerHour)}>
              <FieldLabel htmlFor="area-price">Default Price per Hour</FieldLabel>
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
                  placeholder="500"
                  value={values.pricePerHour}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, pricePerHour: e.target.value }))
                  }
                />
              </InputGroup>
              <FieldError>{errors.pricePerHour}</FieldError>
            </Field>

            <Field data-invalid={Boolean(errors.maxPlayers)}>
              <FieldLabel htmlFor="area-max-players">Max Players</FieldLabel>
              <Input
                id="area-max-players"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                placeholder="20"
                value={values.maxPlayers}
                onChange={(e) =>
                  setValues((v) => ({ ...v, maxPlayers: e.target.value }))
                }
              />
              <FieldError>{errors.maxPlayers}</FieldError>
            </Field>
          </div>

          <Field data-invalid={Boolean(errors.maxConcurrentBookings)}>
            <FieldLabel htmlFor="area-max-bookings">
              Max Concurrent Bookings
            </FieldLabel>
            <Input
              id="area-max-bookings"
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              placeholder="1"
              value={values.maxConcurrentBookings}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  maxConcurrentBookings: e.target.value,
                }))
              }
            />
            <FieldError>{errors.maxConcurrentBookings}</FieldError>
          </Field>
        </FormSection>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? <Spinner /> : <Save className="size-4" />}
          {isEdit ? "Save changes" : "Add area type"}
        </Button>
      </SheetFooter>
    </form>
  )
}

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  area?: AreaType | null
  pending?: boolean
  onSubmit: (values: NewAreaType) => void
}

export function AreaTypeFormSheet({
  open,
  onOpenChange,
  area,
  pending,
  onSubmit,
}: SheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        {open && (
          <FormBody
            key={area?.id ?? "new"}
            area={area}
            pending={pending}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
