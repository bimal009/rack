"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  CURRENCY_OPTIONS,
  updateGymSchema,
  type GymRecord,
  type UpdateGymInput,
} from "@repo/types"

import { Button } from "@repo/ui/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@repo/ui/components/ui/field"
import { Input } from "@repo/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select"
import { Skeleton } from "@repo/ui/components/ui/skeleton"

import { useGymQuery, useUpdateGymMutation } from "@/features/tenant/gyms/hook/useGyms"

function toFormValues(gym: GymRecord): UpdateGymInput {
  return {
    businessName: gym.businessName,
    address: gym.address,
    phone: gym.phone,
    email: gym.email,
    website: gym.website ?? "",
    currency: gym.currency,
  }
}

interface OrganizationFormProps {
  gym: GymRecord
}

function OrganizationForm({ gym }: OrganizationFormProps) {
  const updateGym = useUpdateGymMutation()
  const form = useForm<UpdateGymInput>({
    resolver: zodResolver(updateGymSchema),
    defaultValues: toFormValues(gym),
  })

  function handleSubmit(values: UpdateGymInput) {
    updateGym.mutate({ ...values, website: values.website || undefined }, {
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
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6" noValidate>
      <FieldGroup>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field data-invalid={Boolean(form.formState.errors.businessName)}>
            <FieldLabel htmlFor="org-name">Name</FieldLabel>
            <Input
              id="org-name"
              aria-invalid={Boolean(form.formState.errors.businessName)}
              {...form.register("businessName")}
            />
            <FieldError>{form.formState.errors.businessName?.message}</FieldError>
          </Field>

        </div>

        <Field data-invalid={Boolean(form.formState.errors.address)}>
          <FieldLabel htmlFor="org-address">Address</FieldLabel>
          <Input
            id="org-address"
            aria-invalid={Boolean(form.formState.errors.address)}
            {...form.register("address")}
          />
          <FieldError>{form.formState.errors.address?.message}</FieldError>
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field data-invalid={Boolean(form.formState.errors.phone)}>
            <FieldLabel htmlFor="org-phone">Phone</FieldLabel>
            <Input
              id="org-phone"
              type="tel"
              aria-invalid={Boolean(form.formState.errors.phone)}
              {...form.register("phone")}
            />
            <FieldError>{form.formState.errors.phone?.message}</FieldError>
          </Field>

          <Field data-invalid={Boolean(form.formState.errors.email)}>
            <FieldLabel htmlFor="org-email">Email</FieldLabel>
            <Input
              id="org-email"
              type="email"
              aria-invalid={Boolean(form.formState.errors.email)}
              {...form.register("email")}
            />
            <FieldError>{form.formState.errors.email?.message}</FieldError>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field data-invalid={Boolean(form.formState.errors.website)}>
            <FieldLabel htmlFor="org-website">
              Website{" "}
              <span className="text-muted-foreground">(optional)</span>
            </FieldLabel>
            <Input
              id="org-website"
              placeholder="https://yourbusiness.com"
              aria-invalid={Boolean(form.formState.errors.website)}
              {...form.register("website")}
            />
            <FieldError>{form.formState.errors.website?.message}</FieldError>
          </Field>

          <Field data-invalid={Boolean(form.formState.errors.currency)}>
            <FieldLabel htmlFor="org-currency">Currency</FieldLabel>
            <Controller
              control={form.control}
              name="currency"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="org-currency" className="w-full" aria-invalid={Boolean(form.formState.errors.currency)}>
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
              )}
            />
            <FieldDescription>
              Used for pricing across plans, products, and packages.
            </FieldDescription>
            <FieldError>{form.formState.errors.currency?.message}</FieldError>
          </Field>
        </div>
      </FieldGroup>

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
