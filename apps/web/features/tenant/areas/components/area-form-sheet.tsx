"use client"

import { useState, type KeyboardEvent } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Banknote, Check, Info, MapPin, Save, SlidersHorizontal, X } from "lucide-react"

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
  SheetFooter,
  SheetHeader,
} from "@repo/ui/components/ui/sheet"
import { Spinner } from "@repo/ui/components/ui/spinner"
import { Textarea } from "@repo/ui/components/ui/textarea"
import { cn } from "@repo/ui/lib/utils"

import { MultiImageUpload } from "@/features/media"
import { FormSection, FormSheetHeader } from "@/features/tenant/components/form-section"
import { useAreaTypesQuery } from "@/features/tenant/settings/types/hooks/use-area-types"

import {
  areaInsertSchema,
  areaStatusEnumSchema,
  areaVisibilityEnumSchema,
  type Area,
  type AreaInsertInput,
  type NewArea,
} from "@repo/types"

import { areaAttributeOptions } from "../lib/schema"

function toFormValues(area?: Area | null): NewArea {
  if (!area) {
    return {
      name: "",
      areaTypeId: "",
      description: undefined,
      images: [],
      pricePerHour: 0,
      maxConcurrentBookings: 1,
      visibility: "Public",
      status: "Active",
      attributes: [],
    }
  }
  return {
    name: area.name,
    areaTypeId: area.areaTypeId ?? "",
    description: area.description ?? undefined,
    images: area.images,
    pricePerHour: area.pricePerHour,
    maxConcurrentBookings: area.maxConcurrentBookings,
    visibility: area.visibility,
    status: area.status,
    attributes: area.attributes,
  }
}

interface AreaFormBodyProps {
  tenant: string
  area?: Area | null
  pending?: boolean
  onSubmit: (values: NewArea) => void
  onCancel: () => void
}

function AreaFormBody({ tenant, area, pending, onSubmit, onCancel }: AreaFormBodyProps) {
  const areaTypesQuery = useAreaTypesQuery(tenant, { limit: 100 })
  const areaTypes = areaTypesQuery.data?.data ?? []

  const form = useForm<AreaInsertInput, unknown, NewArea>({
    resolver: zodResolver(areaInsertSchema),
    defaultValues: toFormValues(area),
  })
  const values = useWatch({ control: form.control })
  const [attributeDraft, setAttributeDraft] = useState("")
  const isEdit = Boolean(area)

  function addAttribute(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return
    if (
      (values.attributes ?? []).some((a) => a.toLowerCase() === trimmed.toLowerCase())
    ) {
      setAttributeDraft("")
      return
    }
    form.setValue("attributes", [...(form.getValues("attributes") ?? []), trimmed], { shouldDirty: true })
    setAttributeDraft("")
  }

  function removeAttribute(name: string) {
    form.setValue("attributes", (form.getValues("attributes") ?? []).filter((attribute) => attribute !== name), { shouldDirty: true })
  }

  function onAttributeKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      addAttribute(attributeDraft)
    } else if (
      event.key === "Backspace" &&
      !attributeDraft &&
      (values.attributes ?? []).length
    ) {
      removeAttribute(values.attributes![values.attributes!.length - 1]!)
    }
  }

  const attributeSuggestions = areaAttributeOptions.filter(
    (option) =>
      !(values.attributes ?? []).some((a) => a.toLowerCase() === option.toLowerCase())
  )

  return (
    <form
      onSubmit={form.handleSubmit((values) => onSubmit(areaInsertSchema.parse(values)))}
      className="flex h-full flex-col"
      noValidate
    >
      <SheetHeader>
        <FormSheetHeader
          icon={MapPin}
          title={isEdit ? "Edit area" : "Add area"}
          description="A bookable space in your gym, like a studio or a court."
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <FormSection icon={Info} title="Basic information">
          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={Boolean(form.formState.errors.name)}>
              <FieldLabel htmlFor="area-name">
                Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="area-name"
                placeholder="Studio A"
                aria-invalid={Boolean(form.formState.errors.name)}
                {...form.register("name")}
              />
              <FieldError>{form.formState.errors.name?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="area-type">Area Type</FieldLabel>
              <Select
                value={values.areaTypeId ?? ""}
                onValueChange={(value) => {
                  const picked = areaTypes.find((t) => t.id === value)
                  form.setValue("areaTypeId", value ?? "", { shouldDirty: true })
                  if (picked && !isEdit) {
                    form.setValue("pricePerHour", picked.pricePerHour ?? 0, { shouldDirty: true })
                    form.setValue("maxConcurrentBookings", picked.maxConcurrentBookings ?? 1, { shouldDirty: true })
                  }
                }}
              >
                <SelectTrigger id="area-type" className="w-full">
                  <SelectValue placeholder="Select area type">
                    {(value: string | null) =>
                      areaTypes.find((t) => t.id === value)?.name ??
                      "Select area type"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {areaTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!isEdit && (
                <FieldDescription>
                  Sets a default price and capacity you can adjust below.
                </FieldDescription>
              )}
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="area-description">Description</FieldLabel>
            <Textarea
              id="area-description"
              placeholder="What this space is used for"
              {...form.register("description", { setValueAs: (value: string) => value || undefined })}
            />
          </Field>

          <Field>
            <FieldLabel>Images</FieldLabel>
            <MultiImageUpload
              folder="areas"
              value={values.images ?? []}
              onChange={(images) => form.setValue("images", images, { shouldDirty: true })}
            />
            <FieldDescription>
              Add photos of this space. The first image is used as the cover.
            </FieldDescription>
          </Field>
        </FormSection>

        <FormSection icon={Banknote} title="Pricing">
          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={Boolean(form.formState.errors.pricePerHour)}>
              <FieldLabel htmlFor="area-price">Price per Hour</FieldLabel>
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
                  placeholder="0.00"
                  aria-invalid={Boolean(form.formState.errors.pricePerHour)}
                  {...form.register("pricePerHour", { valueAsNumber: true })}
                />
              </InputGroup>
              <FieldError>{form.formState.errors.pricePerHour?.message}</FieldError>
            </Field>

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
                aria-invalid={Boolean(form.formState.errors.maxConcurrentBookings)}
                {...form.register("maxConcurrentBookings", { valueAsNumber: true })}
              />
              <FieldError>{form.formState.errors.maxConcurrentBookings?.message}</FieldError>
            </Field>
          </div>
        </FormSection>

        <FormSection icon={SlidersHorizontal} title="Settings">
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="area-visibility">Visibility</FieldLabel>
              <Select
                value={values.visibility ?? "Public"}
                onValueChange={(value) => {
                  const visibility = areaVisibilityEnumSchema.options.find((option) => option === value)
                  if (visibility) form.setValue("visibility", visibility, { shouldDirty: true })
                }}
              >
                <SelectTrigger id="area-visibility" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {areaVisibilityEnumSchema.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="area-status">Status</FieldLabel>
              <Select
                value={values.status ?? "Active"}
                onValueChange={(value) => {
                  const status = areaStatusEnumSchema.options.find((option) => option === value)
                  if (status) form.setValue("status", status, { shouldDirty: true })
                }}
              >
                <SelectTrigger id="area-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {areaStatusEnumSchema.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="area-attributes">Attributes</FieldLabel>
            <Input
              id="area-attributes"
              placeholder="Add attributes..."
              value={attributeDraft}
              onChange={(e) => setAttributeDraft(e.target.value)}
              onKeyDown={onAttributeKeyDown}
            />
            {(values.attributes ?? []).length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {(values.attributes ?? []).map((attribute) => (
                  <span
                    key={attribute}
                    className="flex items-center gap-1 rounded-full border border-primary bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
                  >
                    {attribute}
                    <button
                      type="button"
                      onClick={() => removeAttribute(attribute)}
                      aria-label={`Remove ${attribute}`}
                      className="-mr-1 rounded-full p-0.5 hover:bg-primary-foreground/20"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {attributeSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {attributeSuggestions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => addAttribute(option)}
                    className={cn(
                      "flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted/50"
                    )}
                  >
                    <Check className="size-3 opacity-40" />
                    {option}
                  </button>
                ))}
              </div>
            )}
          </Field>
        </FormSection>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? <Spinner /> : <Save className="size-4" />}
          {isEdit ? "Save changes" : "Create area"}
        </Button>
      </SheetFooter>
    </form>
  )
}

interface AreaFormSheetProps {
  tenant: string
  open: boolean
  onOpenChange: (open: boolean) => void
  area?: Area | null
  pending?: boolean
  onSubmit: (values: NewArea) => void
}

export function AreaFormSheet({
  tenant,
  open,
  onOpenChange,
  area,
  pending,
  onSubmit,
}: AreaFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        {open && (
          <AreaFormBody
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
