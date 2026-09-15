"use client"

import { CalendarIcon, InfoIcon, Wallet } from "lucide-react"
import { Controller, useFormContext } from "react-hook-form"
import { gymMembershipStatusEnumSchema } from "@repo/types"

import { Button } from "@repo/ui/components/ui/button"
import { Calendar } from "@repo/ui/components/ui/calendar"
import { Field, FieldError, FieldLabel } from "@repo/ui/components/ui/field"
import { Input } from "@repo/ui/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@repo/ui/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select"
import { Switch } from "@repo/ui/components/ui/switch"
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/components/ui/tooltip"

import { FormSection } from "@/features/tenant/components/form-section"
import { useGymPlansQuery } from "../../revenue/plans/hooks/use-plans"

export function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

export function newMembership() {
  return {
    planId: "",
    status: "Active" as const,
    startDate: formatDate(new Date()),
    price: 0,
    signupFee: null as number | null,
    extendedDays: 0,
    extensionReason: "",
  }
}

interface MembershipSectionProps {
  tenant: string
  namePrefix?: string
  selectedPlanName?: string
}

export function MembershipSection({ tenant, namePrefix = "", selectedPlanName }: MembershipSectionProps) {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<any>()

  const { data: plansResponse } = useGymPlansQuery(tenant, { limit: 100 })
  const plans = plansResponse?.data ?? []

  const name = (field: string) => (namePrefix ? `${namePrefix}.${field}` : field)
  const errorFor = (field: string) =>
    name(field)
      .split(".")
      .reduce((acc: any, key) => acc?.[key], errors)?.message as string | undefined

  const extendedDays = watch(name("extendedDays")) ?? 0

  return (
    <FormSection icon={Wallet} title="Membership Details">
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-foreground">General</p>
        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={Boolean(errorFor("planId"))}>
            <FieldLabel htmlFor="membership-plan">
              Plan <span className="text-destructive">*</span>
            </FieldLabel>
            <Controller
              control={control}
              name={name("planId")}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    if (!value) return
                    field.onChange(value)
                    const plan = plans.find((p) => p.id === value)
                    if (plan) {
                      setValue(name("price"), plan.pricePerPeriod)
                      setValue(name("signupFee"), plan.signupFee ?? null)
                    }
                  }}
                >
                  <SelectTrigger id="membership-plan" className="w-full">
                    <SelectValue placeholder="Select a plan">
                      {plans.find((plan) => plan.id === field.value)?.name ?? selectedPlanName}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{errorFor("planId")}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="membership-status">Status</FieldLabel>
            <Controller
              control={control}
              name={name("status")}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="membership-status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {gymMembershipStatusEnumSchema.options.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-foreground">Pricing</p>
        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={Boolean(errorFor("price"))}>
            <FieldLabel htmlFor="membership-price">
              Price <span className="text-destructive">*</span>
            </FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>NPR</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="membership-price"
                type="number"
                min={0}
                aria-invalid={Boolean(errorFor("price"))}
                {...register(name("price"), { valueAsNumber: true })}
              />
            </InputGroup>
            <FieldError>{errorFor("price")}</FieldError>
          </Field>

          <Field data-invalid={Boolean(errorFor("signupFee"))}>
            <FieldLabel htmlFor="membership-signup-fee">Signup Fee</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>NPR</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="membership-signup-fee"
                type="number"
                min={0}
                placeholder="New members only"
                aria-invalid={Boolean(errorFor("signupFee"))}
                {...register(name("signupFee"), {
                  setValueAs: (v) => (v === "" || v === null || v === undefined ? null : Number(v)),
                })}
              />
            </InputGroup>
            <FieldError>{errorFor("signupFee")}</FieldError>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={Boolean(errorFor("startDate"))}>
            <FieldLabel htmlFor="membership-start">
              Start Date <span className="text-destructive">*</span>
            </FieldLabel>
            <Controller
              control={control}
              name={name("startDate")}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button
                        id="membership-start"
                        type="button"
                        variant="outline"
                        className="w-full justify-start font-normal"
                        aria-invalid={Boolean(errorFor("startDate"))}
                      />
                    }
                  >
                    <CalendarIcon className="size-4" />
                    {field.value
                      ? new Date(`${field.value}T00:00:00`).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Pick a date"}
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(`${field.value}T00:00:00`) : undefined}
                      onSelect={(date) => date && field.onChange(formatDate(date))}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            <FieldError>{errorFor("startDate")}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="membership-end" className="flex items-center gap-1">
              End Date
              <Tooltip>
                <TooltipTrigger
                  type="button"
                  aria-label="About the membership end date"
                  className="inline-flex items-center"
                >
                  <InfoIcon className="size-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  The end date is calculated automatically in the background from the selected
                  plan when you save. Use Extend to add days on top of it.
                </TooltipContent>
              </Tooltip>
            </FieldLabel>
            <p id="membership-end" className="flex h-9 items-center px-3 text-sm text-muted-foreground">
              —
            </p>
          </Field>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <FieldLabel htmlFor="membership-extend" className="font-normal">
              Extend
            </FieldLabel>
            <p className="text-xs text-muted-foreground">
              Adds days on top of the period the plan sets. Recorded with your reason.
            </p>
          </div>
          <Switch
            id="membership-extend"
            checked={extendedDays > 0}
            onCheckedChange={(checked) => {
              setValue(name("extendedDays"), checked ? 1 : 0)
              if (!checked) setValue(name("extensionReason"), "")
            }}
          />
        </div>

        {extendedDays > 0 && (
          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={Boolean(errorFor("extendedDays"))}>
              <FieldLabel htmlFor="membership-extend-days">Extra Days</FieldLabel>
              <Input
                id="membership-extend-days"
                type="number"
                min={1}
                aria-invalid={Boolean(errorFor("extendedDays"))}
                {...register(name("extendedDays"), { valueAsNumber: true })}
              />
              <FieldError>{errorFor("extendedDays")}</FieldError>
            </Field>

            <Field data-invalid={Boolean(errorFor("extensionReason"))}>
              <FieldLabel htmlFor="membership-extend-reason">Reason</FieldLabel>
              <Input
                id="membership-extend-reason"
                placeholder="Why the extension"
                aria-invalid={Boolean(errorFor("extensionReason"))}
                {...register(name("extensionReason"))}
              />
              <FieldError>{errorFor("extensionReason")}</FieldError>
            </Field>
          </div>
        )}
      </div>
    </FormSection>
  )
}