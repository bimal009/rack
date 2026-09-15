"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
function toFormValues(area?: AreaType | null): NewAreaType {
  return {
    name: area?.name ?? "",
    description: area?.description ?? undefined,
    sports: area?.sports ?? [],
    availableForBooking: area?.availableForBooking ?? true,
    pricePerHour: area?.pricePerHour ?? 0,
    maxPlayers: area?.maxPlayers ?? 1,
    maxConcurrentBookings: area?.maxConcurrentBookings ?? 1,
  }
}

interface FormBodyProps {
  tenant: string
  area?: AreaType | null
  pending?: boolean
  onSubmit: (values: NewAreaType) => void
  onCancel: () => void
}

function FormBody({ tenant, area, pending, onSubmit, onCancel }: FormBodyProps) {
  const sportsQuery = useGymSportsQuery(tenant)
  const form = useForm<NewAreaType>({
    resolver: zodResolver(areaTypeInsertSchema),
    defaultValues: toFormValues(area),
  })
  const selectedSports = form.watch("sports") ?? []
  const isEdit = Boolean(area)

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
          icon={LayoutGrid}
          title={isEdit ? "Edit area type" : "Add area type"}
          description="A bookable space like a cycling studio or a strength floor."
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <FormSection icon={LayoutGrid} title="Details">
          <Field data-invalid={Boolean(form.formState.errors.name)}>
            <FieldLabel htmlFor="area-name">
              Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="area-name"
              placeholder="Cycling Studio"
              aria-invalid={Boolean(form.formState.errors.name)}
              {...form.register("name")}
            />
            <FieldError>{form.formState.errors.name?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="area-description">Description</FieldLabel>
            <Textarea
              id="area-description"
              placeholder="A bookable space like a cycling studio or strength floor"
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
              <Switch id="area-available" checked={field.value} onCheckedChange={field.onChange} />
            )} />
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
            <Field data-invalid={Boolean(form.formState.errors.pricePerHour)}>
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
                  {...form.register("pricePerHour", { valueAsNumber: true })}
                />
              </InputGroup>
              <FieldError>{form.formState.errors.pricePerHour?.message}</FieldError>
            </Field>

            <Field data-invalid={Boolean(form.formState.errors.maxPlayers)}>
              <FieldLabel htmlFor="area-max-players">Max Players</FieldLabel>
              <Input
                id="area-max-players"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                placeholder="20"
                {...form.register("maxPlayers", { valueAsNumber: true })}
              />
              <FieldError>{form.formState.errors.maxPlayers?.message}</FieldError>
            </Field>
          </div>

          <Field data-invalid={Boolean(form.formState.errors.maxConcurrentBookings)}>
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
          {isEdit ? "Save changes" : "Add area type"}
        </Button>
      </SheetFooter>
    </form>
  )
}

interface SheetProps {
  tenant: string
  open: boolean
  onOpenChange: (open: boolean) => void
  area?: AreaType | null
  pending?: boolean
  onSubmit: (values: NewAreaType) => void
}

export function AreaTypeFormSheet({
  tenant,
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
            tenant={tenant}
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
