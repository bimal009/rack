"use client"

import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import {
  CURRENCY_OPTIONS,
  DEFAULT_OPENING_HOURS,
  updateGymSchema,
  type Currency,
  type GymRecord,
  type OpeningHours,
} from "@repo/types"

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select"
import { Skeleton } from "@repo/ui/components/ui/skeleton"

import { OpeningHoursEditor } from "@/components/opening-hours-editor"

import { fieldErrors } from "../../lib/validation"
import { useGymQuery, useUpdateGymMutation } from "../../hooks/useOrganization"

interface OrganizationFormValues {
  businessName: string
  address: string
  phone: string
  email: string
  website: string
  currency: Currency
  openingHours: OpeningHours
}

function toFormValues(gym: GymRecord): OrganizationFormValues {
  return {
    businessName: gym.businessName,
    address: gym.address,
    phone: gym.phone,
    email: gym.email,
    website: gym.website ?? "",
    currency: gym.currency,
    openingHours: gym.openingHours ?? DEFAULT_OPENING_HOURS,
  }
}

interface OrganizationFormProps {
  gym: GymRecord
}

function OrganizationForm({ gym }: OrganizationFormProps) {
  const [values, setValues] = useState<OrganizationFormValues>(() =>
    toFormValues(gym)
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [openingHoursError, setOpeningHoursError] = useState("")
  const updateGym = useUpdateGymMutation()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const result = updateGymSchema.safeParse({
      ...values,
      website: values.website || undefined,
    })

    if (!result.success) {
      setErrors(fieldErrors(result.error))
      setOpeningHoursError(
        result.error.issues.some((issue) => issue.path[0] === "openingHours")
          ? "Check your opening hours. Each closing time must be after its opening time."
          : ""
      )
      return
    }

    setErrors({})
    setOpeningHoursError("")
    updateGym.mutate(result.data, {
      onSuccess: () => toast.success("Organization details updated"),
      onError: (error) =>
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not update organization details."
        ),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FieldGroup>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.businessName)}>
            <FieldLabel htmlFor="org-name">Name</FieldLabel>
            <Input
              id="org-name"
              value={values.businessName}
              aria-invalid={Boolean(errors.businessName)}
              onChange={(e) =>
                setValues((v) => ({ ...v, businessName: e.target.value }))
              }
            />
            <FieldError>{errors.businessName}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="org-slug">Slug</FieldLabel>
            <Input id="org-slug" value={gym.slug} disabled />
            <FieldDescription>
              Your workspace URL. Contact support to change it.
            </FieldDescription>
          </Field>
        </div>

        <Field data-invalid={Boolean(errors.address)}>
          <FieldLabel htmlFor="org-address">Address</FieldLabel>
          <Input
            id="org-address"
            value={values.address}
            aria-invalid={Boolean(errors.address)}
            onChange={(e) =>
              setValues((v) => ({ ...v, address: e.target.value }))
            }
          />
          <FieldError>{errors.address}</FieldError>
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.phone)}>
            <FieldLabel htmlFor="org-phone">Phone</FieldLabel>
            <Input
              id="org-phone"
              type="tel"
              value={values.phone}
              aria-invalid={Boolean(errors.phone)}
              onChange={(e) =>
                setValues((v) => ({ ...v, phone: e.target.value }))
              }
            />
            <FieldError>{errors.phone}</FieldError>
          </Field>

          <Field data-invalid={Boolean(errors.email)}>
            <FieldLabel htmlFor="org-email">Email</FieldLabel>
            <Input
              id="org-email"
              type="email"
              value={values.email}
              aria-invalid={Boolean(errors.email)}
              onChange={(e) =>
                setValues((v) => ({ ...v, email: e.target.value }))
              }
            />
            <FieldError>{errors.email}</FieldError>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.website)}>
            <FieldLabel htmlFor="org-website">
              Website{" "}
              <span className="text-muted-foreground">(optional)</span>
            </FieldLabel>
            <Input
              id="org-website"
              placeholder="https://yourbusiness.com"
              value={values.website}
              aria-invalid={Boolean(errors.website)}
              onChange={(e) =>
                setValues((v) => ({ ...v, website: e.target.value }))
              }
            />
            <FieldError>{errors.website}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="org-currency">Currency</FieldLabel>
            <Select
              value={values.currency}
              onValueChange={(value) =>
                setValues((v) => ({ ...v, currency: value as Currency }))
              }
            >
              <SelectTrigger id="org-currency" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>
              Used for pricing across plans, products, and packages.
            </FieldDescription>
          </Field>
        </div>
      </FieldGroup>

      <FieldSet>
        <FieldLegend>Opening Hours</FieldLegend>
        <FieldGroup>
          <FieldDescription>
            Turn off a day if your gym is closed on it.
          </FieldDescription>
          <OpeningHoursEditor
            value={values.openingHours}
            onChange={(openingHours) =>
              setValues((v) => ({ ...v, openingHours }))
            }
          />
          <FieldError>{openingHoursError}</FieldError>
        </FieldGroup>
      </FieldSet>

      <div className="flex justify-end border-t border-border pt-4">
        <Button type="submit" disabled={updateGym.isPending}>
          {updateGym.isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  )
}

export function OrganizationDetailsForm() {
  const { data: gym, isLoading, isError, error } = useGymQuery()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    )
  }

  if (isError || !gym) {
    return (
      <p className="text-sm text-muted-foreground">
        {error instanceof Error
          ? error.message
          : "Could not load organization details."}
      </p>
    )
  }

  return <OrganizationForm gym={gym} />
}
