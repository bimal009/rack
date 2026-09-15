"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  openingHoursFormSchema,
  type OpeningHours,
  type OpeningHoursFormInput,
} from "@repo/types"

import { Button } from "@repo/ui/components/ui/button"
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@repo/ui/components/ui/field"
import { Skeleton } from "@repo/ui/components/ui/skeleton"

import { OpeningHoursEditor } from "@/components/opening-hours-editor"

import {
  useOperatingHoursQuery,
  useUpdateOperatingHours,
} from "../hooks/use-operating-hours"

interface OrganizationHoursFormBodyProps {
  tenant: string
  hours: OpeningHours
}

function OrganizationHoursFormBody({ tenant, hours }: OrganizationHoursFormBodyProps) {
  const updateHours = useUpdateOperatingHours(tenant)
  const form = useForm<OpeningHoursFormInput>({
    resolver: zodResolver(openingHoursFormSchema),
    defaultValues: { openingHours: hours },
  })

  function handleSubmit(values: OpeningHoursFormInput) {
    updateHours.mutate(values.openingHours, {
      onSuccess: () => toast.success("Operating hours updated"),
      onError: (error) =>
        toast.error(
          error instanceof Error ? error.message : "Could not update operating hours."
        ),
    })
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6" noValidate>
      <FieldSet>
        <FieldLegend>Operating Hours</FieldLegend>
        <FieldGroup>
          <FieldDescription>
            Turn off a day if your gym is closed on it.
          </FieldDescription>
          <Controller
            control={form.control}
            name="openingHours"
            render={({ field }) => (
              <OpeningHoursEditor value={field.value} onChange={field.onChange} />
            )}
          />
          <FieldError>{form.formState.errors.openingHours?.message}</FieldError>
        </FieldGroup>
      </FieldSet>

      <div className="flex justify-end border-t border-border pt-4">
        <Button type="submit" disabled={updateHours.isPending}>
          {updateHours.isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  )
}

export function OrganizationHoursForm({ tenant }: { tenant: string }) {
  const { data: hours, isLoading, isError, error } = useOperatingHoursQuery(tenant)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  if (isError || !hours) {
    return (
      <p className="text-sm text-muted-foreground">
        {error instanceof Error ? error.message : "Could not load operating hours."}
      </p>
    )
  }

  return <OrganizationHoursFormBody tenant={tenant} hours={hours} />
}
