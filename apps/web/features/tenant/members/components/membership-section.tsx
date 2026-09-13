"use client"

import { CalendarIcon, InfoIcon, Wallet } from "lucide-react"
import { z } from "zod"
import { gymMembershipAssignmentSchema, gymMembershipStatusEnumSchema } from "@repo/types"

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

export type MembershipValues = z.infer<typeof gymMembershipAssignmentSchema>

export function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

export function newMembership(): MembershipValues {
  return {
    planId: "",
    status: "Active",
    startDate: formatDate(new Date()),
    price: 0,
    signupFee: null,
    extendedDays: 0,
    extensionReason: "",
  }
}

interface MembershipSectionProps {
  tenant: string
  values: MembershipValues
  onChange: (values: MembershipValues) => void
  errors: Record<string, string>
}

export function MembershipSection({ tenant, values, onChange, errors }: MembershipSectionProps) {
  // NOTE: was previously called with no query object, so it silently used
  // whatever the API's default page size is instead of every plan.
  const { data: plansResponse } = useGymPlansQuery(tenant, { limit: 100 })
  const plans = plansResponse?.data ?? []

  function set<K extends keyof MembershipValues>(key: K, value: MembershipValues[K]) {
    onChange({ ...values, [key]: value })
  }

  return (
    <FormSection icon={Wallet} title="Membership Details">
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-foreground">General</p>
        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={Boolean(errors["membership.planId"])}>
            <FieldLabel htmlFor="membership-plan">
              Plan <span className="text-destructive">*</span>
            </FieldLabel>
            <Select
              value={values.planId}
              onValueChange={(value) => {
                if (!value) return
                const plan = plans.find((p) => p.id === value)
                onChange({
                  ...values,
                  planId: value,
                  price: plan?.pricePerPeriod ?? values.price,
                  signupFee: plan?.signupFee ?? null,
                })
              }}
            >
              <SelectTrigger id="membership-plan" className="w-full">
                <SelectValue placeholder="Select a plan">
                  {plans.find((plan) => plan.id === values.planId)?.name}
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
            <FieldError>{errors["membership.planId"]}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="membership-status">Status</FieldLabel>
            <Select
              value={values.status}
              onValueChange={(value) => {
                if (value !== null) set("status", value as MembershipValues["status"])
              }}
            >
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
          </Field>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-foreground">Pricing</p>
        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={Boolean(errors["membership.price"])}>
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
                value={values.price}
                aria-invalid={Boolean(errors["membership.price"])}
                onChange={(e) => set("price", Number(e.target.value))}
              />
            </InputGroup>
            <FieldError>{errors["membership.price"]}</FieldError>
          </Field>

          <Field data-invalid={Boolean(errors["membership.signupFee"])}>
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
                value={values.signupFee ?? ""}
                aria-invalid={Boolean(errors["membership.signupFee"])}
                onChange={(e) =>
                  set("signupFee", e.target.value ? Number(e.target.value) : null)
                }
              />
            </InputGroup>
            <FieldError>{errors["membership.signupFee"]}</FieldError>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={Boolean(errors["membership.startDate"])}>
            <FieldLabel htmlFor="membership-start">
              Start Date <span className="text-destructive">*</span>
            </FieldLabel>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    id="membership-start"
                    type="button"
                    variant="outline"
                    className="w-full justify-start font-normal"
                    aria-invalid={Boolean(errors["membership.startDate"])}
                  />
                }
              >
                <CalendarIcon className="size-4" />
                {new Date(`${values.startDate}T00:00:00`).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={new Date(`${values.startDate}T00:00:00`)}
                  onSelect={(date) => date && set("startDate", formatDate(date))}
                />
              </PopoverContent>
            </Popover>
            <FieldError>{errors["membership.startDate"]}</FieldError>
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
            checked={values.extendedDays > 0}
            onCheckedChange={(checked) => {
              set("extendedDays", checked ? 1 : 0)
              if (!checked) set("extensionReason", "")
            }}
          />
        </div>

        {values.extendedDays > 0 && (
          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={Boolean(errors["membership.extendedDays"])}>
              <FieldLabel htmlFor="membership-extend-days">Extra Days</FieldLabel>
              <Input
                id="membership-extend-days"
                type="number"
                min={1}
                value={values.extendedDays}
                aria-invalid={Boolean(errors["membership.extendedDays"])}
                onChange={(e) => set("extendedDays", Number(e.target.value))}
              />
              <FieldError>{errors["membership.extendedDays"]}</FieldError>
            </Field>

            <Field data-invalid={Boolean(errors["membership.extensionReason"])}>
              <FieldLabel htmlFor="membership-extend-reason">Reason</FieldLabel>
              <Input
                id="membership-extend-reason"
                placeholder="Why the extension"
                value={values.extensionReason ?? ""}
                aria-invalid={Boolean(errors["membership.extensionReason"])}
                onChange={(e) => set("extensionReason", e.target.value)}
              />
              <FieldError>{errors["membership.extensionReason"]}</FieldError>
            </Field>
          </div>
        )}
      </div>
    </FormSection>
  )
}