"use client"

import { useState, type FormEvent, type KeyboardEvent } from "react"
import { useParams } from "next/navigation"
import { Banknote, Check, Info, MapPin, SlidersHorizontal, X } from "lucide-react"

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
import { Textarea } from "@repo/ui/components/ui/textarea"
import { cn } from "@repo/ui/lib/utils"

import { MultiImageUpload } from "@/features/media"
import { FormSection, FormSheetHeader } from "@/features/tenant/components/form-section"
import { useAreaTypesQuery } from "@/features/tenant/settings/types/hooks/use-area-types"

import { fieldErrors } from "../lib/validation"
import {
  areaAttributeOptions,
  areaSchema,
  areaStatuses,
  areaVisibilities,
  type Area,
  type AreaInput,
  type AreaStatus,
  type AreaVisibility,
} from "../lib/schema"

interface AreaFormValues {
  name: string
  areaTypeId: string
  description: string
  images: string[]
  pricePerHour: string
  maxConcurrentBookings: string
  visibility: AreaVisibility
  status: AreaStatus
  attributes: string[]
}

function toFormValues(area?: Area | null): AreaFormValues {
  if (!area) {
    return {
      name: "",
      areaTypeId: "",
      description: "",
      images: [],
      pricePerHour: "",
      maxConcurrentBookings: "1",
      visibility: "Public",
      status: "Active",
      attributes: [],
    }
  }
  return {
    name: area.name,
    areaTypeId: area.areaTypeId ?? "",
    description: area.description ?? "",
    images: area.images,
    pricePerHour: String(area.pricePerHour),
    maxConcurrentBookings: String(area.maxConcurrentBookings),
    visibility: area.visibility,
    status: area.status,
    attributes: area.attributes,
  }
}

interface AreaFormBodyProps {
  area?: Area | null
  onSubmit: (values: AreaInput) => void
  onCancel: () => void
}

function AreaFormBody({ area, onSubmit, onCancel }: AreaFormBodyProps) {
  const tenant = useParams<{ tenant: string }>().tenant
  const areaTypesQuery = useAreaTypesQuery(tenant, { limit: 100 })
  const areaTypes = areaTypesQuery.data?.data ?? []

  const [values, setValues] = useState<AreaFormValues>(() => toFormValues(area))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [attributeDraft, setAttributeDraft] = useState("")
  const isEdit = Boolean(area)

  function addAttribute(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return
    if (
      values.attributes.some((a) => a.toLowerCase() === trimmed.toLowerCase())
    ) {
      setAttributeDraft("")
      return
    }
    setValues((v) => ({ ...v, attributes: [...v.attributes, trimmed] }))
    setAttributeDraft("")
  }

  function removeAttribute(name: string) {
    setValues((v) => ({
      ...v,
      attributes: v.attributes.filter((a) => a !== name),
    }))
  }

  function onAttributeKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      addAttribute(attributeDraft)
    } else if (
      event.key === "Backspace" &&
      !attributeDraft &&
      values.attributes.length
    ) {
      removeAttribute(values.attributes[values.attributes.length - 1]!)
    }
  }

  const attributeSuggestions = areaAttributeOptions.filter(
    (option) =>
      !values.attributes.some((a) => a.toLowerCase() === option.toLowerCase())
  )

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const result = areaSchema.safeParse({
      ...values,
      areaTypeId: values.areaTypeId || undefined,
      description: values.description || undefined,
      pricePerHour: Number(values.pricePerHour || 0),
      maxConcurrentBookings: Number(values.maxConcurrentBookings || 0),
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
          icon={MapPin}
          title={isEdit ? "Edit area" : "Add area"}
          description="A bookable space in your gym, like a studio or a court."
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
                placeholder="Studio A"
                value={values.name}
                aria-invalid={Boolean(errors.name)}
                onChange={(e) =>
                  setValues((v) => ({ ...v, name: e.target.value }))
                }
              />
              <FieldError>{errors.name}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="area-type">Area Type</FieldLabel>
              <Select
                value={values.areaTypeId}
                onValueChange={(value) =>
                  setValues((v) => ({ ...v, areaTypeId: value ?? "" }))
                }
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
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="area-description">Description</FieldLabel>
            <Textarea
              id="area-description"
              placeholder="What this space is used for"
              value={values.description}
              onChange={(e) =>
                setValues((v) => ({ ...v, description: e.target.value }))
              }
            />
          </Field>

          <Field>
            <FieldLabel>Images</FieldLabel>
            <MultiImageUpload
              folder="areas"
              value={values.images}
              onChange={(images) => setValues((v) => ({ ...v, images }))}
            />
            <FieldDescription>
              Add photos of this space. The first image is used as the cover.
            </FieldDescription>
          </Field>
        </FormSection>

        <FormSection icon={Banknote} title="Pricing">
          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={Boolean(errors.pricePerHour)}>
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
                  value={values.pricePerHour}
                  aria-invalid={Boolean(errors.pricePerHour)}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, pricePerHour: e.target.value }))
                  }
                />
              </InputGroup>
              <FieldError>{errors.pricePerHour}</FieldError>
            </Field>

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
                aria-invalid={Boolean(errors.maxConcurrentBookings)}
                onChange={(e) =>
                  setValues((v) => ({
                    ...v,
                    maxConcurrentBookings: e.target.value,
                  }))
                }
              />
              <FieldError>{errors.maxConcurrentBookings}</FieldError>
            </Field>
          </div>
        </FormSection>

        <FormSection icon={SlidersHorizontal} title="Settings">
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="area-visibility">Visibility</FieldLabel>
              <Select
                value={values.visibility}
                onValueChange={(value) =>
                  setValues((v) => ({
                    ...v,
                    visibility: value as AreaVisibility,
                  }))
                }
              >
                <SelectTrigger id="area-visibility" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {areaVisibilities.map((option) => (
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
                value={values.status}
                onValueChange={(value) =>
                  setValues((v) => ({ ...v, status: value as AreaStatus }))
                }
              >
                <SelectTrigger id="area-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {areaStatuses.map((option) => (
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
              placeholder="Search attributes..."
              value={attributeDraft}
              onChange={(e) => setAttributeDraft(e.target.value)}
              onKeyDown={onAttributeKeyDown}
            />
            {values.attributes.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {values.attributes.map((attribute) => (
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
        <Button type="submit">
          {isEdit ? "Save changes" : "Create area"}
        </Button>
      </SheetFooter>
    </form>
  )
}

interface AreaFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  area?: Area | null
  onSubmit: (values: AreaInput) => void
}

export function AreaFormSheet({
  open,
  onOpenChange,
  area,
  onSubmit,
}: AreaFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        {open && (
          <AreaFormBody
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
