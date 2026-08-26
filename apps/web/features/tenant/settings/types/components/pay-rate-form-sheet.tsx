"use client"

import { useState, type FormEvent } from "react"
import { Info } from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
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
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@repo/ui/components/ui/sheet"
import { Switch } from "@repo/ui/components/ui/switch"

import { fieldErrors } from "../lib/validation"
import {
  payRateAppliesTo,
  payRateEntranceMethods,
  payRatePolicySchema,
  type PayRateAppliesTo,
  type PayRateEntranceMethod,
  type PayRatePolicy,
  type PayRatePolicyInput,
} from "../lib/schema"

interface PayRateFormValues {
  policyName: string
  perSessionRate: string
  revenueSharePercent: string
  compensateUnpaidBookings: boolean
  appliesTo: PayRateAppliesTo
  entranceMethod: PayRateEntranceMethod
}

function toFormValues(policy?: PayRatePolicy | null): PayRateFormValues {
  return {
    policyName: policy?.policyName ?? "",
    perSessionRate:
      policy?.perSessionRate !== undefined ? String(policy.perSessionRate) : "",
    revenueSharePercent:
      policy?.revenueSharePercent !== undefined
        ? String(policy.revenueSharePercent)
        : "",
    compensateUnpaidBookings: policy?.compensateUnpaidBookings ?? false,
    appliesTo: policy?.appliesTo ?? "Instructor",
    entranceMethod: policy?.entranceMethod ?? "All entrance methods",
  }
}

interface PayRateFormBodyProps {
  policy?: PayRatePolicy | null
  onSubmit: (values: PayRatePolicyInput) => void
  onCancel: () => void
}

function PayRateFormBody({ policy, onSubmit, onCancel }: PayRateFormBodyProps) {
  const [values, setValues] = useState<PayRateFormValues>(() =>
    toFormValues(policy)
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = Boolean(policy)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const result = payRatePolicySchema.safeParse({
      ...values,
      perSessionRate: values.perSessionRate
        ? Number(values.perSessionRate)
        : undefined,
      revenueSharePercent: values.revenueSharePercent
        ? Number(values.revenueSharePercent)
        : undefined,
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
        <SheetTitle>{isEdit ? "Edit Pay Rate" : "Add Pay Rate"}</SheetTitle>
        <SheetDescription>
          Define how staff earn for sessions they deliver.
        </SheetDescription>
      </SheetHeader>

      <SheetBody className="flex flex-col gap-6">
        <FieldSet>
          <FieldGroup>
            <Field data-invalid={Boolean(errors.policyName)}>
              <FieldLabel htmlFor="pay-rate-name">
                Policy name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="pay-rate-name"
                placeholder="Policy name"
                value={values.policyName}
                aria-invalid={Boolean(errors.policyName)}
                onChange={(e) =>
                  setValues((v) => ({ ...v, policyName: e.target.value }))
                }
              />
              <FieldError>{errors.policyName}</FieldError>
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Earnings</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="pay-rate-per-session">
                Per session
              </FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>NPR</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="pay-rate-per-session"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="1"
                  value={values.perSessionRate}
                  onChange={(e) =>
                    setValues((v) => ({
                      ...v,
                      perSessionRate: e.target.value,
                    }))
                  }
                />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="pay-rate-revenue-share">
                % of total session revenue
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="pay-rate-revenue-share"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="100"
                  step="1"
                  value={values.revenueSharePercent}
                  onChange={(e) =>
                    setValues((v) => ({
                      ...v,
                      revenueSharePercent: e.target.value,
                    }))
                  }
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>%</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <Field orientation="horizontal">
              <Switch
                id="pay-rate-unpaid"
                checked={values.compensateUnpaidBookings}
                onCheckedChange={(checked) =>
                  setValues((v) => ({
                    ...v,
                    compensateUnpaidBookings: checked,
                  }))
                }
              />
              <div className="flex items-center gap-1.5">
                <FieldLabel htmlFor="pay-rate-unpaid">
                  Compensate for unpaid bookings
                </FieldLabel>
                <Info className="size-3.5 text-muted-foreground" />
              </div>
            </Field>
            <FieldDescription>
              Paid for every booking, including unpaid and no-shows.
            </FieldDescription>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Applies to</FieldLegend>
          <FieldGroup>
            <Field>
              <Select
                value={values.appliesTo}
                onValueChange={(value) =>
                  setValues((v) => ({
                    ...v,
                    appliesTo: value as PayRateAppliesTo,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {payRateAppliesTo.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <Select
                value={values.entranceMethod}
                onValueChange={(value) =>
                  setValues((v) => ({
                    ...v,
                    entranceMethod: value as PayRateEntranceMethod,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {payRateEntranceMethods.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </FieldSet>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isEdit ? "Save changes" : "Add pay rate"}</Button>
      </SheetFooter>
    </form>
  )
}

interface PayRateFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  policy?: PayRatePolicy | null
  onSubmit: (values: PayRatePolicyInput) => void
}

export function PayRateFormSheet({
  open,
  onOpenChange,
  policy,
  onSubmit,
}: PayRateFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        {open && (
          <PayRateFormBody
            key={policy?.id ?? "new"}
            policy={policy}
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
