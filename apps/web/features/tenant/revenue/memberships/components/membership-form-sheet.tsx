"use client"

import { useState, type FormEvent } from "react"
import { Banknote, CreditCard, Info, Sparkles, SquareCheck } from "lucide-react"
import { SPECIALTY_OPTIONS } from "@repo/types"

import { Button } from "@repo/ui/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@repo/ui/components/ui/combobox"
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
import { Label } from "@repo/ui/components/ui/label"
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
import { Textarea } from "@repo/ui/components/ui/textarea"

import { FormSection, FormSheetHeader } from "@/features/tenant/components/form-section"

import { fieldErrors } from "../../lib/validation"
import {
  billingTypes,
  planCategories,
  planCoverages,
  planFeatureOptions,
  planSchema,
  planVisibilities,
  type BillingType,
  type Plan,
  type PlanCategory,
  type PlanCoverage,
  type PlanInput,
  type PlanVisibility,
} from "../lib/schema"

interface PlanFormValues {
  name: string
  category: PlanCategory | ""
  visibility: PlanVisibility
  description: string
  active: boolean

  pricePerPeriod: string
  billingType: BillingType | ""
  signupFee: string
  requirePaymentUpfront: boolean

  coverage: PlanCoverage
  sessions: string

  features: string
  sports: string
}

function toFormValues(plan?: Plan | null): PlanFormValues {
  if (!plan) {
    return {
      name: "",
      category: "",
      visibility: "Public",
      description: "",
      active: true,
      pricePerPeriod: "",
      billingType: "",
      signupFee: "",
      requirePaymentUpfront: true,
      coverage: "General plan",
      sessions: "",
      features: "",
      sports: "",
    }
  }
  return {
    name: plan.name,
    category: plan.category,
    visibility: plan.visibility,
    description: plan.description ?? "",
    active: plan.active,
    pricePerPeriod: String(plan.pricePerPeriod),
    billingType: plan.billingType,
    signupFee: plan.signupFee != null ? String(plan.signupFee) : "",
    requirePaymentUpfront: plan.requirePaymentUpfront,
    coverage: plan.coverage,
    sessions: plan.sessions ?? "",
    features: plan.features ?? "",
    sports: plan.sports ?? "",
  }
}

interface PlanFormBodyProps {
  plan?: Plan | null
  onSubmit: (values: PlanInput) => void
  onCancel: () => void
}

function PlanFormBody({ plan, onSubmit, onCancel }: PlanFormBodyProps) {
  const [values, setValues] = useState<PlanFormValues>(() =>
    toFormValues(plan)
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = Boolean(plan)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const result = planSchema.safeParse({
      ...values,
      category: values.category || undefined,
      billingType: values.billingType || undefined,
      signupFee: values.signupFee === "" ? undefined : values.signupFee,
    })

    if (!result.success) {
      setErrors(fieldErrors(result.error))
      return
    }

    onSubmit(result.data)
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <SheetHeader>
        <FormSheetHeader
          icon={CreditCard}
          title={isEdit ? "Edit plan" : "Add plan"}
          description={
            isEdit
              ? "Update this membership plan's pricing and details."
              : "Create a membership plan members can subscribe to."
          }
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <FormSection icon={Info} title="General">
          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={Boolean(errors.name)}>
              <FieldLabel htmlFor="plan-name">Plan name</FieldLabel>
              <Input
                id="plan-name"
                placeholder="Gold Membership"
                value={values.name}
                aria-invalid={Boolean(errors.name)}
                onChange={(e) =>
                  setValues((v) => ({ ...v, name: e.target.value }))
                }
              />
              <FieldError>{errors.name}</FieldError>
            </Field>

            <Field data-invalid={Boolean(errors.category)}>
              <FieldLabel htmlFor="plan-category">Category</FieldLabel>
              <Select
                value={values.category}
                onValueChange={(value) =>
                  setValues((v) => ({
                    ...v,
                    category: value as PlanCategory,
                  }))
                }
              >
                <SelectTrigger
                  id="plan-category"
                  className="w-full"
                  aria-invalid={Boolean(errors.category)}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {planCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{errors.category}</FieldError>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">


            <Field>
              <FieldLabel htmlFor="plan-visibility">Visibility</FieldLabel>
              <Select
                value={values.visibility}
                onValueChange={(value) =>
                  setValues((v) => ({
                    ...v,
                    visibility: value as PlanVisibility,
                  }))
                }
              >
                <SelectTrigger id="plan-visibility" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {planVisibilities.map((visibility) => (
                    <SelectItem key={visibility} value={visibility}>
                      {visibility}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

                      <div className="flex items-center gap-2.5">
            <Switch
              id="plan-active"
              checked={values.active}
              onCheckedChange={(checked) =>
                setValues((v) => ({ ...v, active: checked }))
              }
            />
            <Label htmlFor="plan-active">Active</Label>
          </div>
          </div>

          <Field data-invalid={Boolean(errors.description)}>
            <FieldLabel htmlFor="plan-description">
              Description{" "}
              <span className="text-muted-foreground">(optional)</span>
            </FieldLabel>
            <Textarea
              id="plan-description"
              placeholder="What members get with this plan"
              value={values.description}
              aria-invalid={Boolean(errors.description)}
              onChange={(e) =>
                setValues((v) => ({ ...v, description: e.target.value }))
              }
            />
            <FieldError>{errors.description}</FieldError>
          </Field>


        </FormSection>

        <FormSection icon={Banknote} title="Pricing">
          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={Boolean(errors.pricePerPeriod)}>
              <FieldLabel htmlFor="plan-price">Price per period</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>NPR</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="plan-price"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={values.pricePerPeriod}
                  aria-invalid={Boolean(errors.pricePerPeriod)}
                  onChange={(e) =>
                    setValues((v) => ({
                      ...v,
                      pricePerPeriod: e.target.value,
                    }))
                  }
                />
              </InputGroup>
              <FieldError>{errors.pricePerPeriod}</FieldError>
            </Field>

            <Field data-invalid={Boolean(errors.billingType)}>
              <FieldLabel htmlFor="plan-billing-type">Type</FieldLabel>
              <Select
                value={values.billingType}
                onValueChange={(value) =>
                  setValues((v) => ({
                    ...v,
                    billingType: value as BillingType,
                  }))
                }
              >
                <SelectTrigger
                  id="plan-billing-type"
                  className="w-full"
                  aria-invalid={Boolean(errors.billingType)}
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {billingTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{errors.billingType}</FieldError>
            </Field>
          </div>

          <Field data-invalid={Boolean(errors.signupFee)}>
            <FieldLabel htmlFor="plan-signup-fee">Signup fee</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>NPR</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="plan-signup-fee"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={values.signupFee}
                aria-invalid={Boolean(errors.signupFee)}
                onChange={(e) =>
                  setValues((v) => ({ ...v, signupFee: e.target.value }))
                }
              />
            </InputGroup>
            <FieldDescription>
              One-time fee charged when joining.
            </FieldDescription>
            <FieldError>{errors.signupFee}</FieldError>
          </Field>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <Switch
                id="plan-require-payment"
                checked={values.requirePaymentUpfront}
                onCheckedChange={(checked) =>
                  setValues((v) => ({
                    ...v,
                    requirePaymentUpfront: checked,
                  }))
                }
              />
              <Label htmlFor="plan-require-payment">
                Require payment upfront
              </Label>
            </div>
            <FieldDescription>
              The membership only starts once it has been paid.
            </FieldDescription>
          </div>
        </FormSection>

        <FormSection
          icon={SquareCheck}
          title="Validity"
          description="Check-ins and dynamic pricing only, no booking access."
        >
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="plan-coverage">Coverage</FieldLabel>
              <Select
                value={values.coverage}
                onValueChange={(value) =>
                  setValues((v) => ({
                    ...v,
                    coverage: value as PlanCoverage,
                  }))
                }
              >
                <SelectTrigger id="plan-coverage" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {planCoverages.map((coverage) => (
                    <SelectItem key={coverage} value={coverage}>
                      {coverage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="plan-sessions">Sessions</FieldLabel>
              <Input
                id="plan-sessions"
                placeholder="e.g. 10/month"
                value={values.sessions}
                onChange={(e) =>
                  setValues((v) => ({ ...v, sessions: e.target.value }))
                }
              />
              <FieldDescription>
                Uses per billing period (e.g. 10/month).
              </FieldDescription>
            </Field>
          </div>
        </FormSection>

        <FormSection icon={Sparkles} title="Presentation">
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="plan-features">Features</FieldLabel>
              <Combobox
                items={planFeatureOptions}
                value={values.features || null}
                onValueChange={(value) =>
                  setValues((v) => ({ ...v, features: value ?? "" }))
                }
              >
                <ComboboxInput
                  id="plan-features"
                  placeholder="Search features..."
                />
                <ComboboxContent>
                  <ComboboxEmpty>No features found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item: string) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>

            <Field>
              <FieldLabel htmlFor="plan-sports">Sports</FieldLabel>
              <Combobox
                items={SPECIALTY_OPTIONS}
                value={values.sports || null}
                onValueChange={(value) =>
                  setValues((v) => ({ ...v, sports: value ?? "" }))
                }
              >
                <ComboboxInput
                  id="plan-sports"
                  placeholder="Search sports..."
                />
                <ComboboxContent>
                  <ComboboxEmpty>No sports found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item: string) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
          </div>
        </FormSection>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEdit ? "Save changes" : "Create plan"}
        </Button>
      </SheetFooter>
    </form>
  )
}

interface PlanFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan?: Plan | null
  onSubmit: (values: PlanInput) => void
}

export function PlanFormSheet({
  open,
  onOpenChange,
  plan,
  onSubmit,
}: PlanFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        {open && (
          <PlanFormBody
            key={plan?.id ?? "new"}
            plan={plan}
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
