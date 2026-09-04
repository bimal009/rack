"use client"

import { useState, type FormEvent } from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { openingHoursSchema, type OpeningHours } from "@repo/types"

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
  const [values, setValues] = useState<OpeningHours>(hours)
  const [error, setError] = useState("")
  const updateHours = useUpdateOperatingHours(tenant)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const result = openingHoursSchema.safeParse(values)
    if (!result.success) {
      setError("Check your hours. Each closing time must be after its opening time.")
      return
    }

    setError("")
    updateHours.mutate(result.data, {
      onSuccess: () => toast.success("Operating hours updated"),
      onError: (error) =>
        toast.error(
          error instanceof Error ? error.message : "Could not update operating hours."
        ),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FieldSet>
        <FieldLegend>Operating Hours</FieldLegend>
        <FieldGroup>
          <FieldDescription>
            Turn off a day if your gym is closed on it.
          </FieldDescription>
          <OpeningHoursEditor value={values} onChange={setValues} />
          <FieldError>{error}</FieldError>
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

export function OrganizationHoursForm() {
  const tenant = useParams<{ tenant: string }>().tenant
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
