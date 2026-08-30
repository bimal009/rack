"use client"

import { useState, type FormEvent } from "react"
import { useParams } from "next/navigation"
import { Banknote, Check, CreditCard, Info, Sparkles, SquareCheck } from "lucide-react"
import { SPECIALTY_OPTIONS } from "@repo/types"

import { Button } from "@repo/ui/components/ui/button"
import { Checkbox } from "@repo/ui/components/ui/checkbox"
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
import { cn } from "@repo/ui/lib/utils"

import { FormSection, FormSheetHeader } from "@/features/tenant/components/form-section"
import { useAreaTypesQuery } from "@/features/tenant/settings/types/hooks/use-area-types"
import { useClassTypesQuery } from "@/features/tenant/settings/types/hooks/use-class-types"
import { useInstructorTypesQuery } from "@/features/tenant/settings/types/hooks/use-instructor-types"

import { fieldErrors } from "../../lib/validation"
import {
  billingTypes,
  membershipCategories,
  membershipCoverages,
  membershipFeatureOptions,
  membershipSchema,
  membershipVisibilities,
  type BillingType,
  type Membership,
  type MembershipCategory,
  type MembershipCoverage,
  type MembershipInput,
  type MembershipVisibility,
} from "../lib/schema"

interface MembershipFormValues {
  name: string
  category: MembershipCategory | ""
  visibility: MembershipVisibility
  description: string
  active: boolean

  pricePerPeriod: string
  billingType: BillingType | ""
  signupFee: string
  requirePaymentUpfront: boolean

  coverage: MembershipCoverage
  coverageClasses: string[]
  coverageAreas: string[]
  coverageInstructors: string[]
  noClasses: boolean
  noAreas: boolean
  noInstructors: boolean
  sessions: string

  features: string
  sports: string
}

function toFormValues(membership?: Membership | null): MembershipFormValues {
  if (!membership) {
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
      coverage: "Full access",
      coverageClasses: [],
      coverageAreas: [],
      coverageInstructors: [],
      noClasses: false,
      noAreas: false,
      noInstructors: false,
      sessions: "",
      features: "",
      sports: "",
    }
  }
  return {
    name: membership.name,
    category: membership.category,
    visibility: membership.visibility,
    description: membership.description ?? "",
    active: membership.active,
    pricePerPeriod: String(membership.pricePerPeriod),
    billingType: membership.billingType,
    signupFee: membership.signupFee != null ? String(membership.signupFee) : "",
    requirePaymentUpfront: membership.requirePaymentUpfront,
    coverage: membership.coverage,
    coverageClasses: membership.coverageClasses ?? [],
    coverageAreas: membership.coverageAreas ?? [],
    coverageInstructors: membership.coverageInstructors ?? [],
    noClasses: membership.noClasses ?? false,
    noAreas: membership.noAreas ?? false,
    noInstructors: membership.noInstructors ?? false,
    sessions: membership.sessions ?? "",
    features: membership.features ?? "",
    sports: membership.sports ?? "",
  }
}

function listOrNull(none: boolean, ids: string[]): string[] | null {
  if (none) return null
  return ids.length > 0 ? ids : null
}

interface CoveragePickerProps {
  label: string
  noneLabel: string
  options: { id: string; name: string }[]
  selected: string[]
  onToggle: (id: string) => void
  none: boolean
  onNoneChange: (none: boolean) => void
}

function CoveragePicker({
  label,
  noneLabel,
  options,
  selected,
  onToggle,
  none,
  onNoneChange,
}: CoveragePickerProps) {
  return (
    <Field>
      <div className="flex items-center justify-between">
        <FieldLabel>{label}</FieldLabel>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <Checkbox
            checked={none}
            onCheckedChange={(checked) => onNoneChange(checked === true)}
          />
          {noneLabel}
        </label>
      </div>

      {!none && (
        <>
          <div className="flex flex-wrap gap-1.5">
            {options.map((option) => {
              const isSelected = selected.includes(option.id)
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onToggle(option.id)}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground hover:bg-muted/50"
                  )}
                >
                  {isSelected && <Check className="size-3" />}
                  {option.name}
                </button>
              )
            })}
          </div>
          <FieldDescription>
            Leave empty to include all {label.toLowerCase()}.
          </FieldDescription>
        </>
      )}
    </Field>
  )
}

interface MembershipFormBodyProps {
  membership?: Membership | null
  onSubmit: (values: MembershipInput) => void
  onCancel: () => void
}

function MembershipFormBody({
  membership,
  onSubmit,
  onCancel,
}: MembershipFormBodyProps) {
  const tenant = useParams<{ tenant: string }>().tenant
  const classTypes = useClassTypesQuery(tenant, { limit: 100 })
  const areaTypes = useAreaTypesQuery(tenant, { limit: 100 })
  const instructorTypes = useInstructorTypesQuery(tenant, { limit: 100 })

  const [values, setValues] = useState<MembershipFormValues>(() =>
    toFormValues(membership)
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = Boolean(membership)
  const isRestricted = values.coverage === "Restricted"

  function toggle(
    key: "coverageClasses" | "coverageAreas" | "coverageInstructors",
    id: string
  ) {
    setValues((v) => ({
      ...v,
      [key]: v[key].includes(id)
        ? v[key].filter((x) => x !== id)
        : [...v[key], id],
    }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const result = membershipSchema.safeParse({
      ...values,
      category: values.category || undefined,
      billingType: values.billingType || undefined,
      signupFee: values.signupFee === "" ? undefined : values.signupFee,
      coverageClasses: isRestricted
        ? listOrNull(values.noClasses, values.coverageClasses)
        : null,
      coverageAreas: isRestricted
        ? listOrNull(values.noAreas, values.coverageAreas)
        : null,
      coverageInstructors: isRestricted
        ? listOrNull(values.noInstructors, values.coverageInstructors)
        : null,
      noClasses: isRestricted && values.noClasses,
      noAreas: isRestricted && values.noAreas,
      noInstructors: isRestricted && values.noInstructors,
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
          title={isEdit ? "Edit membership" : "Add membership"}
          description={
            isEdit
              ? "Update this membership's pricing and details."
              : "Create a membership members can subscribe to."
          }
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <FormSection icon={Info} title="General">
          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={Boolean(errors.name)}>
              <FieldLabel htmlFor="membership-name">Membership name</FieldLabel>
              <Input
                id="membership-name"
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
              <FieldLabel htmlFor="membership-category">Category</FieldLabel>
              <Select
                value={values.category}
                onValueChange={(value) =>
                  setValues((v) => ({
                    ...v,
                    category: value as MembershipCategory,
                  }))
                }
              >
                <SelectTrigger
                  id="membership-category"
                  className="w-full"
                  aria-invalid={Boolean(errors.category)}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {membershipCategories.map((category) => (
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
              <FieldLabel htmlFor="membership-visibility">Visibility</FieldLabel>
              <Select
                value={values.visibility}
                onValueChange={(value) =>
                  setValues((v) => ({
                    ...v,
                    visibility: value as MembershipVisibility,
                  }))
                }
              >
                <SelectTrigger id="membership-visibility" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {membershipVisibilities.map((visibility) => (
                    <SelectItem key={visibility} value={visibility}>
                      {visibility}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <div className="flex items-center gap-2.5 pt-6">
              <Switch
                id="membership-active"
                checked={values.active}
                onCheckedChange={(checked) =>
                  setValues((v) => ({ ...v, active: checked }))
                }
              />
              <Label htmlFor="membership-active">Active</Label>
            </div>
          </div>

          <Field data-invalid={Boolean(errors.description)}>
            <FieldLabel htmlFor="membership-description">
              Description{" "}
              <span className="text-muted-foreground">(optional)</span>
            </FieldLabel>
            <Textarea
              id="membership-description"
              placeholder="What members get with this membership"
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
              <FieldLabel htmlFor="membership-price">Price per period</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>NPR</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="membership-price"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder="4900"
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
              <FieldLabel htmlFor="membership-billing-type">Type</FieldLabel>
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
                  id="membership-billing-type"
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
            <FieldLabel htmlFor="membership-signup-fee">Signup fee</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>NPR</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="membership-signup-fee"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="1000"
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
                id="membership-require-payment"
                checked={values.requirePaymentUpfront}
                onCheckedChange={(checked) =>
                  setValues((v) => ({
                    ...v,
                    requirePaymentUpfront: checked,
                  }))
                }
              />
              <Label htmlFor="membership-require-payment">
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
          description="What this membership grants access to."
        >
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="membership-coverage">Coverage</FieldLabel>
              <Select
                value={values.coverage}
                onValueChange={(value) =>
                  setValues((v) => ({
                    ...v,
                    coverage: value as MembershipCoverage,
                  }))
                }
              >
                <SelectTrigger id="membership-coverage" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {membershipCoverages.map((coverage) => (
                    <SelectItem key={coverage} value={coverage}>
                      {coverage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                {isRestricted
                  ? "Covers only what you allow below."
                  : "Covers every class, area and instructor."}
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="membership-sessions">Sessions</FieldLabel>
              <Input
                id="membership-sessions"
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

          {isRestricted && (
            <div className="flex flex-col gap-6 rounded-lg border border-border bg-muted/20 p-4">
              <CoveragePicker
                label="Classes"
                noneLabel="No classes"
                options={classTypes.data?.data ?? []}
                selected={values.coverageClasses}
                onToggle={(id) => toggle("coverageClasses", id)}
                none={values.noClasses}
                onNoneChange={(none) =>
                  setValues((v) => ({ ...v, noClasses: none }))
                }
              />
              <CoveragePicker
                label="Areas"
                noneLabel="No areas"
                options={areaTypes.data?.data ?? []}
                selected={values.coverageAreas}
                onToggle={(id) => toggle("coverageAreas", id)}
                none={values.noAreas}
                onNoneChange={(none) =>
                  setValues((v) => ({ ...v, noAreas: none }))
                }
              />
              <CoveragePicker
                label="Instructors"
                noneLabel="No instructors"
                options={instructorTypes.data?.data ?? []}
                selected={values.coverageInstructors}
                onToggle={(id) => toggle("coverageInstructors", id)}
                none={values.noInstructors}
                onNoneChange={(none) =>
                  setValues((v) => ({ ...v, noInstructors: none }))
                }
              />
            </div>
          )}
        </FormSection>

        <FormSection icon={Sparkles} title="Presentation">
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="membership-features">Features</FieldLabel>
              <Combobox
                items={membershipFeatureOptions}
                value={values.features || null}
                onValueChange={(value) =>
                  setValues((v) => ({ ...v, features: value ?? "" }))
                }
              >
                <ComboboxInput
                  id="membership-features"
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
              <FieldLabel htmlFor="membership-sports">Sports</FieldLabel>
              <Combobox
                items={SPECIALTY_OPTIONS}
                value={values.sports || null}
                onValueChange={(value) =>
                  setValues((v) => ({ ...v, sports: value ?? "" }))
                }
              >
                <ComboboxInput
                  id="membership-sports"
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
          {isEdit ? "Save changes" : "Create membership"}
        </Button>
      </SheetFooter>
    </form>
  )
}

interface MembershipFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  membership?: Membership | null
  onSubmit: (values: MembershipInput) => void
}

export function MembershipFormSheet({
  open,
  onOpenChange,
  membership,
  onSubmit,
}: MembershipFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        {open && (
          <MembershipFormBody
            key={membership?.id ?? "new"}
            membership={membership}
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
