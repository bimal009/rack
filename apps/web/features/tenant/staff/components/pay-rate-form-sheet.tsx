"use client"

import { useState, type FormEvent } from "react"
import { Banknote, BadgeDollarSign, Info, Target } from "lucide-react"

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
import { Switch } from "@repo/ui/components/ui/switch"
import { cn } from "@repo/ui/lib/utils"

import { FormSection, FormSheetHeader } from "@/features/tenant/components/form-section"

import { fieldErrors } from "../lib/validation"
import { classScopeOptions } from "../lib/pay-rate-data"
import {
  payRateAppliesToRoles,
  payRateEntranceMethods,
  payRateModes,
  payRatePolicySchema,
  type PayRateAppliesToRole,
  type PayRateEntranceMethod,
  type PayRateMode,
  type PayRatePolicy,
  type PayRatePolicyInput,
} from "../lib/pay-rate-schema"

interface PayRateFormValues {
  mode: PayRateMode
  policyName: string
  perClassRate: string
  perPersonRate: string
  perSessionRate: string
  revenueSharePercent: string
  compensateUnpaidBookings: boolean
  classScope: string
  appliesToRole: PayRateAppliesToRole
  entranceMethod: PayRateEntranceMethod
}

function toFormValues(policy?: PayRatePolicy | null): PayRateFormValues {
  return {
    mode: policy?.mode ?? "Class",
    policyName: policy?.policyName ?? "",
    perClassRate:
      policy?.perClassRate !== undefined ? String(policy.perClassRate) : "",
    perPersonRate:
      policy?.perPersonRate !== undefined ? String(policy.perPersonRate) : "",
    perSessionRate:
      policy?.perSessionRate !== undefined
        ? String(policy.perSessionRate)
        : "",
    revenueSharePercent:
      policy?.revenueSharePercent !== undefined
        ? String(policy.revenueSharePercent)
        : "",
    compensateUnpaidBookings: policy?.compensateUnpaidBookings ?? false,
    classScope: policy?.classScope ?? "All classes",
    appliesToRole: policy?.appliesToRole ?? "Instructor",
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
  const isClass = values.mode === "Class"

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const result = payRatePolicySchema.safeParse({
      mode: values.mode,
      policyName: values.policyName,
      perClassRate: isClass && values.perClassRate ? Number(values.perClassRate) : undefined,
      perPersonRate: isClass && values.perPersonRate ? Number(values.perPersonRate) : undefined,
      perSessionRate: !isClass && values.perSessionRate ? Number(values.perSessionRate) : undefined,
      revenueSharePercent: values.revenueSharePercent
        ? Number(values.revenueSharePercent)
        : undefined,
      compensateUnpaidBookings: values.compensateUnpaidBookings,
      classScope: isClass ? values.classScope : undefined,
      appliesToRole: values.appliesToRole,
      entranceMethod: values.entranceMethod,
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
          icon={BadgeDollarSign}
          title={isEdit ? "Edit pay rate" : "Add pay rate"}
          description="Define how staff earn for classes or individual training sessions."
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <div className="grid grid-cols-2 gap-1 rounded-full border border-border bg-card p-1">
          {payRateModes.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setValues((v) => ({ ...v, mode }))}
              className={cn(
                "rounded-full px-3 py-1.5 text-center text-sm font-medium whitespace-nowrap transition-colors",
                values.mode === mode
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {mode}
            </button>
          ))}
        </div>

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

        <FormSection icon={Banknote} title="Earnings">
          {isClass ? (
            <>
              <Field>
                <FieldLabel htmlFor="pay-rate-per-class">
                  Per class
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>NPR</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="pay-rate-per-class"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={values.perClassRate}
                    onChange={(e) =>
                      setValues((v) => ({
                        ...v,
                        perClassRate: e.target.value,
                      }))
                    }
                  />
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel htmlFor="pay-rate-per-person">
                  Per person
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>NPR</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="pay-rate-per-person"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={values.perPersonRate}
                    onChange={(e) =>
                      setValues((v) => ({
                        ...v,
                        perPersonRate: e.target.value,
                      }))
                    }
                  />
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel htmlFor="pay-rate-revenue-share">
                  % of total class revenue
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
            </>
          ) : (
            <>
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
                <FieldLabel htmlFor="pay-rate-revenue-share-session">
                  % of total session revenue
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="pay-rate-revenue-share-session"
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
            </>
          )}

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
                Pay for no-shows and unpaid bookings
              </FieldLabel>
              <Info className="size-3.5 text-muted-foreground" />
            </div>
          </Field>
          <FieldDescription>
            When on, the instructor gets paid for every booked spot, even if
            the member didn&apos;t pay or show up. Turn this off to only pay
            for bookings that were paid and completed.
          </FieldDescription>
        </FormSection>

        <FormSection icon={Target} title="Applies to">
          {isClass && (
            <Field>
              <Select
                value={values.classScope}
                onValueChange={(value) =>
                  setValues((v) => ({ ...v, classScope: value ?? "" }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {classScopeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}

          <Field>
            <Select
              value={values.appliesToRole}
              onValueChange={(value) =>
                setValues((v) => ({
                  ...v,
                  appliesToRole: value as PayRateAppliesToRole,
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {payRateAppliesToRoles.map((option) => (
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
        </FormSection>
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
