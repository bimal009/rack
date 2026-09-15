"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Banknote, Check, Dumbbell, Save } from "lucide-react"
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
import { Spinner } from "@repo/ui/components/ui/spinner"
import { Switch } from "@repo/ui/components/ui/switch"
import { Textarea } from "@repo/ui/components/ui/textarea"
import { cn } from "@repo/ui/lib/utils"

import { FormSection, FormSheetHeader } from "@/features/tenant/components/form-section"

import { useGymSportsQuery } from "../hooks/use-gym-sports"
function toFormValues(type?: ClassType | null): NewClassType {
  return {
    name: type?.name ?? "",
    description: type?.description ?? undefined,
    sports: type?.sports ?? [],
    availableForBooking: type?.availableForBooking ?? true,
    pricePerClass: type?.pricePerClass ?? 0,
    maxParticipants: type?.maxParticipants ?? 1,
    maxConcurrentBookings: type?.maxConcurrentBookings ?? 1,
  }
}

interface FormBodyProps {
  tenant: string
  type?: ClassType | null
  pending?: boolean
  onSubmit: (values: NewClassType) => void
  onCancel: () => void
}

function FormBody({ tenant, type, pending, onSubmit, onCancel }: FormBodyProps) {
  const sportsQuery = useGymSportsQuery(tenant)
  const form = useForm<NewClassType>({
    resolver: zodResolver(classTypeInsertSchema),
    defaultValues: toFormValues(type),
  })
  const selectedSports = form.watch("sports") ?? []
  const isEdit = Boolean(type)

  function toggleSport(name: string) {
    const sports = form.getValues("sports") ?? []
    form.setValue(
      "sports",
      sports.includes(name)
        ? sports.filter((sport) => sport !== name)
        : [...sports, name],
      { shouldDirty: true }
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col" noValidate>
      <SheetHeader>
        <FormSheetHeader
          icon={Dumbbell}
          title={isEdit ? "Edit class type" : "Add class type"}
          description="A class members can book, like Yoga Flow or CrossFit WOD."
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <FormSection icon={Dumbbell} title="Details">
          <Field data-invalid={Boolean(form.formState.errors.name)}>
            <FieldLabel htmlFor="class-name">
              Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="class-name"
              placeholder="Yoga Flow, CrossFit WOD"
              aria-invalid={Boolean(form.formState.errors.name)}
              {...form.register("name")}
            />
            <FieldError>{form.formState.errors.name?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="class-description">Description</FieldLabel>
            <Textarea
              id="class-description"
              placeholder="A class members can book, like Yoga Flow or CrossFit WOD"
              {...form.register("description", { setValueAs: (value: string) => value || undefined })}
            />
          </Field>

          <Field>
            <FieldLabel>Sports</FieldLabel>
            <div className="flex flex-wrap gap-1.5">
              {(sportsQuery.data?.data ?? []).map((sport) => {
                const selected = selectedSports.includes(sport.name)
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
            <Controller control={form.control} name="availableForBooking" render={({ field }) => (
              <Switch id="class-available" checked={field.value} onCheckedChange={field.onChange} />
            )} />
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
            <Field data-invalid={Boolean(form.formState.errors.pricePerClass)}>
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
                  placeholder="800"
                  {...form.register("pricePerClass", { valueAsNumber: true })}
                />
              </InputGroup>
              <FieldError>{form.formState.errors.pricePerClass?.message}</FieldError>
            </Field>

            <Field data-invalid={Boolean(form.formState.errors.maxParticipants)}>
              <FieldLabel htmlFor="class-max-participants">
                Max Participants
              </FieldLabel>
              <Input
                id="class-max-participants"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                placeholder="15"
                {...form.register("maxParticipants", { valueAsNumber: true })}
              />
              <FieldError>{form.formState.errors.maxParticipants?.message}</FieldError>
            </Field>
          </div>

          <Field data-invalid={Boolean(form.formState.errors.maxConcurrentBookings)}>
            <FieldLabel htmlFor="class-max-bookings">
              Max Concurrent Bookings
            </FieldLabel>
            <Input
              id="class-max-bookings"
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              placeholder="1"
              {...form.register("maxConcurrentBookings", { valueAsNumber: true })}
            />
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
          {isEdit ? "Save changes" : "Add class type"}
        </Button>
      </SheetFooter>
    </form>
  )
}

interface SheetProps {
  tenant: string
  open: boolean
  onOpenChange: (open: boolean) => void
  type?: ClassType | null
  pending?: boolean
  onSubmit: (values: NewClassType) => void
}

export function ClassTypeFormSheet({
  tenant,
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
            tenant={tenant}
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
