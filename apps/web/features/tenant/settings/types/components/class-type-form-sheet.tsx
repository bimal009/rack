"use client"

import { useState, type FormEvent } from "react"
import { useParams } from "next/navigation"
import { Banknote, Check, Dumbbell } from "lucide-react"
import { classTypeInsertSchema } from "@repo/types"
import type { ClassType, NewClassType } from "@repo/types"

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
import { cn } from "@repo/ui/lib/utils"

import { FormSection, FormSheetHeader } from "@/features/tenant/components/form-section"

import { useGymSportsQuery } from "../hooks/use-gym-sports"
import { fieldErrors } from "../lib/validation"

interface FormValues {
  name: string
  description: string
  sports: string[]
  availableForBooking: boolean
  pricePerClass: string
  maxParticipants: string
  maxConcurrentBookings: string
}

function toFormValues(type?: ClassType | null): FormValues {
  return {
    name: type?.name ?? "",
    description: type?.description ?? "",
    sports: type?.sports ?? [],
    availableForBooking: type?.availableForBooking ?? true,
    pricePerClass: String(type?.pricePerClass ?? 0),
    maxParticipants: String(type?.maxParticipants ?? 1),
    maxConcurrentBookings: String(type?.maxConcurrentBookings ?? 1),
  }
}

interface FormBodyProps {
  type?: ClassType | null
  pending?: boolean
  onSubmit: (values: NewClassType) => void
  onCancel: () => void
}

function FormBody({ type, pending, onSubmit, onCancel }: FormBodyProps) {
  const tenant = useParams<{ tenant: string }>().tenant
  const sportsQuery = useGymSportsQuery(tenant)
  const [values, setValues] = useState<FormValues>(() => toFormValues(type))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = Boolean(type)

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

    const result = classTypeInsertSchema.safeParse({
      name: values.name,
      description: values.description || undefined,
      sports: values.sports,
      availableForBooking: values.availableForBooking,
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
        <FormSheetHeader
          icon={Dumbbell}
          title={isEdit ? "Edit class type" : "Add class type"}
          description="A class members can book, like Yoga Flow or CrossFit WOD."
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <FormSection icon={Dumbbell} title="Details">
          <Field data-invalid={Boolean(errors.name)}>
            <FieldLabel htmlFor="class-name">
              Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="class-name"
              value={values.name}
              aria-invalid={Boolean(errors.name)}
              onChange={(e) =>
                setValues((v) => ({ ...v, name: e.target.value }))
              }
            />
            <FieldError>{errors.name}</FieldError>
          </Field>

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
            <Field data-invalid={Boolean(errors.pricePerClass)}>
              <FieldLabel htmlFor="class-price">Default Price per Class</FieldLabel>
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
                    setValues((v) => ({ ...v, pricePerClass: e.target.value }))
                  }
                />
              </InputGroup>
              <FieldError>{errors.pricePerClass}</FieldError>
            </Field>

            <Field data-invalid={Boolean(errors.maxParticipants)}>
              <FieldLabel htmlFor="class-max-participants">
                Max Participants
              </FieldLabel>
              <Input
                id="class-max-participants"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                value={values.maxParticipants}
                onChange={(e) =>
                  setValues((v) => ({ ...v, maxParticipants: e.target.value }))
                }
              />
              <FieldError>{errors.maxParticipants}</FieldError>
            </Field>
          </div>

          <Field data-invalid={Boolean(errors.maxConcurrentBookings)}>
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
            <FieldError>{errors.maxConcurrentBookings}</FieldError>
          </Field>
        </FormSection>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {isEdit ? "Save changes" : "Add class type"}
        </Button>
      </SheetFooter>
    </form>
  )
}

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type?: ClassType | null
  pending?: boolean
  onSubmit: (values: NewClassType) => void
}

export function ClassTypeFormSheet({
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
