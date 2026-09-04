"use client"

import { useState, type FormEvent } from "react"
import { useParams } from "next/navigation"
import { Banknote, Check, CreditCard, Info, Sparkles, SquareCheck } from "lucide-react"
import {
  membershipPlanBillingTypeEnumSchema,
  membershipPlanBillingUnitEnumSchema,
  membershipPlanCoverageEnumSchema,
  membershipPlanInsertSchema,
  membershipPlanVisibilityEnumSchema,
  type MembershipPlan,
  type MembershipPlanBillingType,
  type MembershipPlanBillingUnit,
  type MembershipPlanCoverage,
  type MembershipPlanVisibility,
  type NewMembershipPlan,
} from "@repo/types"

import { Button } from "@repo/ui/components/ui/button"
import { Checkbox } from "@repo/ui/components/ui/checkbox"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
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
import { useGymFeaturesQuery } from "@/features/tenant/settings/types/hooks/use-gym-features"
import { useGymSportsQuery } from "@/features/tenant/settings/types/hooks/use-gym-sports"
import { useInstructorTypesQuery } from "@/features/tenant/settings/types/hooks/use-instructor-types"
import { useMembershipCategoriesQuery } from "@/features/tenant/settings/types/hooks/use-membership-categories"

import { fieldErrors } from "../../lib/validation"

const billingTypeLabels: Record<MembershipPlanBillingType, string> = {
  one_time: "One-time",
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  annually: "Annually",
  custom: "Custom",
}

const billingUnitLabels: Record<MembershipPlanBillingUnit, string> = {
  day: "day(s)",
  week: "week(s)",
  month: "month(s)",
}

interface MembershipFormValues {
  name: string
  categoryId: string
  visibility: MembershipPlanVisibility
  description: string
  isActive: boolean

  pricePerPeriod: string
  billingType: MembershipPlanBillingType | ""
  billingIntervalUnit: MembershipPlanBillingUnit | ""
  billingIntervalCount: string
  signupFee: string
  requirePaymentUpfront: boolean

  coverage: MembershipPlanCoverage
  coverageClasses: string[]
  coverageAreas: string[]
  coverageInstructors: string[]
  noClasses: boolean
  noAreas: boolean
  noInstructors: boolean
  sessions: string

  sportIds: string[]
  featureIds: string[]
}

function toFormValues(plan?: MembershipPlan | null): MembershipFormValues {
  if (!plan) {
    return {
      name: "",
      categoryId: "",
      visibility: "Public",
      description: "",
      isActive: true,
      pricePerPeriod: "",
      billingType: "",
      billingIntervalUnit: "",
      billingIntervalCount: "",
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
      sportIds: [],
      featureIds: [],
    }
  }
  return {
    name: plan.name,
    categoryId: plan.categoryId,
    visibility: plan.visibility,
    description: plan.description ?? "",
    isActive: plan.isActive,
    pricePerPeriod: String(plan.pricePerPeriod),
    billingType: plan.billingType,
    billingIntervalUnit: plan.billingIntervalUnit ?? "",
    billingIntervalCount:
      plan.billingIntervalCount != null ? String(plan.billingIntervalCount) : "",
    signupFee: plan.signupFee != null ? String(plan.signupFee) : "",
    requirePaymentUpfront: plan.requirePaymentUpfront,
    coverage: plan.coverage,
    coverageClasses: plan.coverageClasses ?? [],
    coverageAreas: plan.coverageAreas ?? [],
    coverageInstructors: plan.coverageInstructors ?? [],
    noClasses: plan.noClasses,
    noAreas: plan.noAreas,
    noInstructors: plan.noInstructors,
    sessions: plan.sessions ?? "",
    sportIds: plan.sports.map((s) => s.sportId),
    featureIds: plan.features.map((f) => f.featureId),
  }
}

function listOrNull(none: boolean, ids: string[]): string[] | null {
  if (none) return null
  return ids.length > 0 ? ids : null
}

interface ComboboxOption {
  value: string
  label: string
}

interface MultiSelectComboboxProps {
  label: string
  description?: string
  placeholder: string
  emptyMessage: string
  options: { id: string; name: string }[]
  selected: string[]
  onChange: (ids: string[]) => void
}

function MultiSelectCombobox({
  label,
  description,
  placeholder,
  emptyMessage,
  options,
  selected,
  onChange,
}: MultiSelectComboboxProps) {
  const anchor = useComboboxAnchor()
  const items: ComboboxOption[] = options.map((option) => ({
    value: option.id,
    label: option.name,
  }))
  const selectedItems = items.filter((item) => selected.includes(item.value))

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Combobox
        items={items}
        multiple
        value={selectedItems}
        onValueChange={(next) => onChange(next.map((item) => item.value))}
      >
        <ComboboxChips ref={anchor}>
          {selectedItems.map((item) => (
            <ComboboxChip key={item.value}>{item.label}</ComboboxChip>
          ))}
          <ComboboxChipsInput
            placeholder={selectedItems.length === 0 ? placeholder : undefined}
          />
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
          <ComboboxList>
            {(item: ComboboxOption) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  )
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
  membership?: MembershipPlan | null
  pending?: boolean
  onSubmit: (values: NewMembershipPlan) => void
  onCancel: () => void
}

function MembershipFormBody({
  membership,
  pending,
  onSubmit,
  onCancel,
}: MembershipFormBodyProps) {
  const tenant = useParams<{ tenant: string }>().tenant
  const categories = useMembershipCategoriesQuery(tenant, { limit: 100 })
  const sports = useGymSportsQuery(tenant, { limit: 100 })
  const features = useGymFeaturesQuery(tenant, { limit: 100 })
  const classTypes = useClassTypesQuery(tenant, { limit: 100 })
  const areaTypes = useAreaTypesQuery(tenant, { limit: 100 })
  const instructorTypes = useInstructorTypesQuery(tenant, { limit: 100 })

  const [values, setValues] = useState<MembershipFormValues>(() =>
    toFormValues(membership)
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = Boolean(membership)
  const isRestricted = values.coverage === "Restricted"
  const isCustomBilling = values.billingType === "custom"

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

    const result = membershipPlanInsertSchema.safeParse({
      name: values.name,
      categoryId: values.categoryId,
      visibility: values.visibility,
      description: values.description || undefined,
      isActive: values.isActive,
      pricePerPeriod: Number(values.pricePerPeriod || 0),
      billingType: values.billingType || undefined,
      billingIntervalUnit: isCustomBilling
        ? values.billingIntervalUnit || undefined
        : undefined,
      billingIntervalCount: isCustomBilling
        ? values.billingIntervalCount === ""
          ? undefined
          : Number(values.billingIntervalCount)
        : undefined,
      signupFee: values.signupFee === "" ? undefined : Number(values.signupFee),
      requirePaymentUpfront: values.requirePaymentUpfront,
      coverage: values.coverage,
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
      sessions: values.sessions || undefined,
      sportIds: values.sportIds,
      featureIds: values.featureIds,
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

            <Field data-invalid={Boolean(errors.categoryId)}>
              <FieldLabel htmlFor="membership-category">Category</FieldLabel>
              <Select
                value={values.categoryId}
                onValueChange={(value) =>
                  setValues((v) => ({ ...v, categoryId: value ?? "" }))
                }
              >
                <SelectTrigger
                  id="membership-category"
                  className="w-full"
                  aria-invalid={Boolean(errors.categoryId)}
                >
                  <SelectValue placeholder="Select category">
                    {() =>
                      categories.data?.data.find(
                        (category) => category.id === values.categoryId
                      )?.name ?? "Select category"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(categories.data?.data ?? []).map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{errors.categoryId}</FieldError>
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
                    visibility: value as MembershipPlanVisibility,
                  }))
                }
              >
                <SelectTrigger id="membership-visibility" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {membershipPlanVisibilityEnumSchema.options.map((visibility) => (
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
                checked={values.isActive}
                onCheckedChange={(checked) =>
                  setValues((v) => ({ ...v, isActive: checked }))
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
                  step="1"
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
                    billingType: value as MembershipPlanBillingType,
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
                  {membershipPlanBillingTypeEnumSchema.options.map((type) => (
                    <SelectItem key={type} value={type}>
                      {billingTypeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{errors.billingType}</FieldError>
            </Field>
          </div>

          {isCustomBilling && (
            <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-muted/20 p-4">
              <Field data-invalid={Boolean(errors.billingIntervalCount)}>
                <FieldLabel htmlFor="membership-billing-count">
                  Period
                </FieldLabel>
                <Input
                  id="membership-billing-count"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  placeholder="2"
                  value={values.billingIntervalCount}
                  aria-invalid={Boolean(errors.billingIntervalCount)}
                  onChange={(e) =>
                    setValues((v) => ({
                      ...v,
                      billingIntervalCount: e.target.value,
                    }))
                  }
                />
                <FieldError>{errors.billingIntervalCount}</FieldError>
              </Field>

              <Field data-invalid={Boolean(errors.billingIntervalUnit)}>
                <FieldLabel htmlFor="membership-billing-unit">Unit</FieldLabel>
                <Select
                  value={values.billingIntervalUnit}
                  onValueChange={(value) =>
                    setValues((v) => ({
                      ...v,
                      billingIntervalUnit: value as MembershipPlanBillingUnit,
                    }))
                  }
                >
                  <SelectTrigger
                    id="membership-billing-unit"
                    className="w-full"
                    aria-invalid={Boolean(errors.billingIntervalUnit)}
                  >
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {membershipPlanBillingUnitEnumSchema.options.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {billingUnitLabels[unit]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{errors.billingIntervalUnit}</FieldError>
              </Field>
            </div>
          )}

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
                step="1"
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
                    coverage: value as MembershipPlanCoverage,
                  }))
                }
              >
                <SelectTrigger id="membership-coverage" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {membershipPlanCoverageEnumSchema.options.map((coverage) => (
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
            <MultiSelectCombobox
              label="Features"
              description="Highlighted perks shown to members."
              placeholder="Search features..."
              emptyMessage="No features found."
              options={features.data?.data ?? []}
              selected={values.featureIds}
              onChange={(ids) => setValues((v) => ({ ...v, featureIds: ids }))}
            />
            <MultiSelectCombobox
              label="Sports"
              description="Sports this membership covers."
              placeholder="Search sports..."
              emptyMessage="No sports found."
              options={sports.data?.data ?? []}
              selected={values.sportIds}
              onChange={(ids) => setValues((v) => ({ ...v, sportIds: ids }))}
            />
          </div>
        </FormSection>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {isEdit ? "Save changes" : "Create membership"}
        </Button>
      </SheetFooter>
    </form>
  )
}

interface MembershipFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  membership?: MembershipPlan | null
  pending?: boolean
  onSubmit: (values: NewMembershipPlan) => void
}

export function MembershipFormSheet({
  open,
  onOpenChange,
  membership,
  pending,
  onSubmit,
}: MembershipFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        {open && (
          <MembershipFormBody
            key={membership?.id ?? "new"}
            membership={membership}
            pending={pending}
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
