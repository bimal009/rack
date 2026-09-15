"use client"

import {
  useForm,
  useWatch,
  type FieldPath,
  type FieldPathValue,
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Banknote, BadgeDollarSign, Info, Save, Target } from "lucide-react"
import {
  payRateEntranceMethodEnumSchema,
  payRateInsertSchema,
  payRateTypeEnumSchema,
  type NewPayRate,
  type PayRateInsertInput,
  type PayRate,
  type PayRateType,
} from "@repo/types"

import { Button } from "@repo/ui/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@repo/ui/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@repo/ui/components/ui/input-group"
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
  SheetFooter,
  SheetHeader,
} from "@repo/ui/components/ui/sheet"
import { Spinner } from "@repo/ui/components/ui/spinner"
import { Switch } from "@repo/ui/components/ui/switch"
import { cn } from "@repo/ui/lib/utils"

import { FormSection, FormSheetHeader } from "@/features/tenant/components/form-section"
import { useClassTypesQuery } from "@/features/tenant/settings/types/hooks/use-class-types"
import { useInstructorTypesQuery } from "@/features/tenant/settings/types/hooks/use-instructor-types"

const ALL = "all"

const payRateTypeLabels: Record<PayRateType, string> = {
  class: "Class",
  individual: "Individual training",
}

function toFormValues(policy?: PayRate | null): PayRateInsertInput {
  return {
    type: policy?.type ?? "class",
    name: policy?.name ?? "",
    perClassRate: policy?.perClassRate ?? undefined,
    perPersonRate: policy?.perPersonRate ?? undefined,
    perSessionRate: policy?.perSessionRate ?? undefined,
    revenueSharePercent: policy?.revenueSharePercent ?? undefined,
    compensateUnpaidBookings: policy?.compensateUnpaidBookings ?? false,
    classTypeId: policy?.classTypeId ?? "",
    instructorTypeId: policy?.instructorTypeId ?? "",
    entranceMethod: policy?.entranceMethod ?? "All entrance methods",
  }
}

interface FormBodyProps {
  tenant: string
  policy?: PayRate | null
  pending?: boolean
  onSubmit: (values: NewPayRate) => void
  onCancel: () => void
}

function FormBody({ tenant, policy, pending, onSubmit, onCancel }: FormBodyProps) {
  const classTypes = useClassTypesQuery(tenant, { limit: 100 })
  const instructorTypes = useInstructorTypesQuery(tenant, { limit: 100 })

  const form = useForm<PayRateInsertInput, unknown, NewPayRate>({
    resolver: zodResolver(payRateInsertSchema),
    defaultValues: toFormValues(policy),
  })
  const values = useWatch({
    control: form.control,
    defaultValue: toFormValues(policy),
  })
  const isEdit = Boolean(policy)
  const isClass = values.type === "class"

  function set<K extends FieldPath<PayRateInsertInput>>(
    key: K,
    value: FieldPathValue<PayRateInsertInput, K>
  ) {
    form.setValue(key, value, { shouldDirty: true })
  }

  const classTypeItems = [
    { value: ALL, label: "All classes" },
    ...(classTypes.data?.data ?? []).map((t) => ({ value: t.id, label: t.name })),
  ]
  const instructorTypeItems = [
    { value: ALL, label: "All instructors" },
    ...(instructorTypes.data?.data ?? []).map((t) => ({
      value: t.id,
      label: t.name,
    })),
  ]
  const entranceMethodItems = payRateEntranceMethodEnumSchema.options.map(
    (method) => ({ value: method, label: method })
  )

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col" noValidate>
      <SheetHeader>
        <FormSheetHeader
          icon={BadgeDollarSign}
          title={isEdit ? "Edit pay rate" : "Add pay rate"}
          description="Define how instructors earn for classes or individual training sessions."
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <div className="grid grid-cols-2 gap-1 rounded-full border border-border bg-card p-1">
          {payRateTypeEnumSchema.options.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => set("type", type)}
              className={cn(
                "rounded-full px-3 py-1.5 text-center text-sm font-medium transition-colors",
                values.type === type
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {payRateTypeLabels[type]}
            </button>
          ))}
        </div>

        <FormSection icon={BadgeDollarSign} title="Details">
          <Field data-invalid={Boolean(form.formState.errors.name)}>
            <FieldLabel htmlFor="pay-rate-name">
              Policy name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="pay-rate-name"
              placeholder="Standard instructor rate"
              value={values.name}
              aria-invalid={Boolean(form.formState.errors.name)}
              onChange={(e) => set("name", e.target.value)}
            />
            <FieldError>{form.formState.errors.name?.message}</FieldError>
          </Field>
        </FormSection>

        <FormSection
          icon={Banknote}
          title="Earnings"
          description="Leave a field blank if it does not apply."
        >
          {isClass ? (
            <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={Boolean(form.formState.errors.perClassRate)}>
                <FieldLabel htmlFor="pay-rate-per-class">Per class</FieldLabel>
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
                    placeholder="800"
                    value={values.perClassRate}
                  onChange={(e) => set("perClassRate", e.target.value === "" ? undefined : Number(e.target.value))}
                  />
                </InputGroup>
              <FieldError>{form.formState.errors.perClassRate?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="pay-rate-per-person">Per person</FieldLabel>
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
                    placeholder="200"
                    value={values.perPersonRate}
                  onChange={(e) => set("perPersonRate", e.target.value === "" ? undefined : Number(e.target.value))}
                  />
                </InputGroup>
              </Field>
            </div>
          ) : (
            <Field data-invalid={Boolean(form.formState.errors.perSessionRate)}>
              <FieldLabel htmlFor="pay-rate-per-session">Per session</FieldLabel>
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
                  placeholder="1500"
                  value={values.perSessionRate}
                  onChange={(e) => set("perSessionRate", e.target.value === "" ? undefined : Number(e.target.value))}
                />
              </InputGroup>
              <FieldError>{form.formState.errors.perSessionRate?.message}</FieldError>
            </Field>
          )}

          <Field>
            <FieldLabel htmlFor="pay-rate-revenue-share">
              {isClass ? "% of class revenue" : "% of session revenue"}
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="pay-rate-revenue-share"
                type="number"
                inputMode="decimal"
                min="0"
                max="100"
                step="1"
                placeholder="40"
                value={values.revenueSharePercent}
                  onChange={(e) => set("revenueSharePercent", e.target.value === "" ? undefined : Number(e.target.value))}
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
                set("compensateUnpaidBookings", checked)
              }
            />
            <div>
              <div className="flex items-center gap-1.5">
                <FieldLabel htmlFor="pay-rate-unpaid">
                  Pay for no-shows and unpaid bookings
                </FieldLabel>
                <Info className="size-3.5 text-muted-foreground" />
              </div>
              <FieldDescription>
                When on, the instructor is paid for every booked spot, even if
                the member did not pay or show up.
              </FieldDescription>
            </div>
          </Field>
        </FormSection>

        <FormSection
          icon={Target}
          title="Applies to"
          description="Narrow this pay rate to specific classes or instructors."
        >
          {isClass && (
            <Field>
              <FieldLabel htmlFor="pay-rate-class-type">Class type</FieldLabel>
              <Select
                items={classTypeItems}
                value={values.classTypeId || ALL}
                onValueChange={(value) =>
            set("classTypeId", value === ALL ? null : value)
                }
              >
                <SelectTrigger id="pay-rate-class-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {classTypeItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}

          <Field>
            <FieldLabel htmlFor="pay-rate-instructor-type">
              Instructor type
            </FieldLabel>
            <Select
              items={instructorTypeItems}
              value={values.instructorTypeId || ALL}
              onValueChange={(value) =>
            set("instructorTypeId", value === ALL ? null : value)
              }
            >
              <SelectTrigger id="pay-rate-instructor-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {instructorTypeItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>
              A specific instructor type overrides the &quot;All instructors&quot;
              rate.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="pay-rate-entrance-method">
              Entrance method
            </FieldLabel>
            <Select
              items={entranceMethodItems}
              value={values.entranceMethod}
          onValueChange={(value) => {
            const entranceMethod = payRateEntranceMethodEnumSchema.options.find(
              (method) => method === value
            )
            if (entranceMethod) set("entranceMethod", entranceMethod)
          }}
            >
              <SelectTrigger id="pay-rate-entrance-method" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {entranceMethodItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>
              How the member paid for or accessed the session.
            </FieldDescription>
          </Field>
        </FormSection>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? <Spinner /> : <Save className="size-4" />}
          {isEdit ? "Save changes" : "Add pay rate"}
        </Button>
      </SheetFooter>
    </form>
  )
}

interface PayRateFormSheetProps {
  tenant: string
  open: boolean
  onOpenChange: (open: boolean) => void
  policy?: PayRate | null
  pending?: boolean
  onSubmit: (values: NewPayRate) => void
}

export function PayRateFormSheet({
  tenant,
  open,
  onOpenChange,
  policy,
  pending,
  onSubmit,
}: PayRateFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        {open && (
          <FormBody
            key={policy?.id ?? "new"}
            tenant={tenant}
            policy={policy}
            pending={pending}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
