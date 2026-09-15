"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save, Tag } from "lucide-react"
import { simpleTypeSchema, type SimpleTypeInput } from "@repo/types"

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
import { Spinner } from "@repo/ui/components/ui/spinner"

import { FormSection, FormSheetHeader } from "@/features/tenant/components/form-section"

export type SimpleItem = { id: string; name: string; rate?: number }
export type SimpleValues = SimpleTypeInput

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  label: string
  hasRate?: boolean
  namePlaceholder?: string
  item: SimpleItem | null
  pending?: boolean
  onSubmit: (values: SimpleValues) => void
}

function Body({
  label,
  hasRate,
  namePlaceholder,
  item,
  pending,
  onSubmit,
  onCancel,
}: Omit<Props, "open" | "onOpenChange"> & { onCancel: () => void }) {
  const form = useForm<SimpleTypeInput>({
    resolver: zodResolver(simpleTypeSchema),
    defaultValues: { name: item?.name ?? "", rate: item?.rate },
  })
  const isEdit = Boolean(item)

  return (
    <form
      onSubmit={form.handleSubmit((values) =>
        onSubmit({ ...values, rate: hasRate ? values.rate : undefined })
      )}
      className="flex h-full flex-col"
      noValidate
    >
      <SheetHeader>
        <FormSheetHeader
          icon={Tag}
          title={isEdit ? `Edit ${label}` : `Add ${label}`}
          description={
            isEdit
              ? `Update this ${label.toLowerCase()}.`
              : `Add a new ${label.toLowerCase()} for your gym.`
          }
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <FormSection icon={Tag} title="Details">
          <Field data-invalid={Boolean(form.formState.errors.name)}>
            <FieldLabel htmlFor="type-name">
              Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="type-name"
              placeholder={namePlaceholder ?? `e.g. ${label}`}
              aria-invalid={Boolean(form.formState.errors.name)}
              {...form.register("name")}
            />
            <FieldError>{form.formState.errors.name?.message}</FieldError>
          </Field>

          {hasRate && (
            <Field data-invalid={Boolean(form.formState.errors.rate)}>
              <FieldLabel htmlFor="type-rate">Rate</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="type-rate"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="13"
                  aria-invalid={Boolean(form.formState.errors.rate)}
                  {...form.register("rate", { valueAsNumber: true })}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>%</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldError>{form.formState.errors.rate?.message}</FieldError>
            </Field>
          )}
        </FormSection>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? <Spinner /> : <Save className="size-4" />}
          {isEdit ? "Save changes" : `Add ${label.toLowerCase()}`}
        </Button>
      </SheetFooter>
    </form>
  )
}

export function TypeFormSheet({
  open,
  onOpenChange,
  label,
  hasRate,
  namePlaceholder,
  item,
  pending,
  onSubmit,
}: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        {open && (
          <Body
            key={item?.id ?? "new"}
            label={label}
            hasRate={hasRate}
            namePlaceholder={namePlaceholder}
            item={item}
            pending={pending}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
