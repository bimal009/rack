"use client"

import { useState, type FormEvent } from "react"

import { Button } from "@repo/ui/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field"
import { Input } from "@repo/ui/components/ui/input"
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
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@repo/ui/components/ui/sheet"

import { fieldErrors } from "../../lib/validation"
import {
  packageSchema,
  packageStatuses,
  type Package,
  type PackageInput,
  type PackageStatus,
} from "../lib/schema"

interface PackageFormValues {
  name: string
  sessions: string
  price: string
  validityDays: string
  status: PackageStatus
}

function toFormValues(pkg?: Package | null): PackageFormValues {
  if (!pkg) {
    return { name: "", sessions: "", price: "", validityDays: "", status: "Active" }
  }
  return {
    name: pkg.name,
    sessions: String(pkg.sessions),
    price: String(pkg.price),
    validityDays: String(pkg.validityDays),
    status: pkg.status,
  }
}

interface PackageFormBodyProps {
  pkg?: Package | null
  onSubmit: (values: PackageInput) => void
  onCancel: () => void
}

function PackageFormBody({ pkg, onSubmit, onCancel }: PackageFormBodyProps) {
  const [values, setValues] = useState<PackageFormValues>(() =>
    toFormValues(pkg)
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = Boolean(pkg)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const result = packageSchema.safeParse(values)

    if (!result.success) {
      setErrors(fieldErrors(result.error))
      return
    }

    onSubmit(result.data)
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <SheetHeader>
        <SheetTitle>{isEdit ? "Edit package" : "Add package"}</SheetTitle>
        <SheetDescription>
          {isEdit
            ? "Update this session package's credits and price."
            : "Create a session or credit pack members can purchase."}
        </SheetDescription>
      </SheetHeader>

      <SheetBody>
        <FieldGroup>
          <Field data-invalid={Boolean(errors.name)}>
            <FieldLabel htmlFor="package-name">Package name</FieldLabel>
            <Input
              id="package-name"
              placeholder="10 Session Pack"
              value={values.name}
              aria-invalid={Boolean(errors.name)}
              onChange={(e) =>
                setValues((v) => ({ ...v, name: e.target.value }))
              }
            />
            <FieldError>{errors.name}</FieldError>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={Boolean(errors.sessions)}>
              <FieldLabel htmlFor="package-sessions">Sessions</FieldLabel>
              <Input
                id="package-sessions"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                placeholder="10"
                value={values.sessions}
                aria-invalid={Boolean(errors.sessions)}
                onChange={(e) =>
                  setValues((v) => ({ ...v, sessions: e.target.value }))
                }
              />
              <FieldError>{errors.sessions}</FieldError>
            </Field>

            <Field data-invalid={Boolean(errors.price)}>
              <FieldLabel htmlFor="package-price">Price</FieldLabel>
              <Input
                id="package-price"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="150"
                value={values.price}
                aria-invalid={Boolean(errors.price)}
                onChange={(e) =>
                  setValues((v) => ({ ...v, price: e.target.value }))
                }
              />
              <FieldError>{errors.price}</FieldError>
            </Field>
          </div>

          <Field data-invalid={Boolean(errors.validityDays)}>
            <FieldLabel htmlFor="package-validity">
              Validity (days)
            </FieldLabel>
            <Input
              id="package-validity"
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              placeholder="90"
              value={values.validityDays}
              aria-invalid={Boolean(errors.validityDays)}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  validityDays: e.target.value,
                }))
              }
            />
            <FieldDescription>
              Days a member has to use all sessions after purchase.
            </FieldDescription>
            <FieldError>{errors.validityDays}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="package-status">Status</FieldLabel>
            <Select
              value={values.status}
              onValueChange={(value) =>
                setValues((v) => ({
                  ...v,
                  status: value as PackageStatus,
                }))
              }
            >
              <SelectTrigger id="package-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {packageStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>
              Draft packages are hidden from members until published.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEdit ? "Save changes" : "Create package"}
        </Button>
      </SheetFooter>
    </form>
  )
}

interface PackageFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pkg?: Package | null
  onSubmit: (values: PackageInput) => void
}

export function PackageFormSheet({
  open,
  onOpenChange,
  pkg,
  onSubmit,
}: PackageFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        {open && (
          <PackageFormBody
            key={pkg?.id ?? "new"}
            pkg={pkg}
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
