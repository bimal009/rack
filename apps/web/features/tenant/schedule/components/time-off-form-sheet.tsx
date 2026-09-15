"use client"

import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarOff, UserRound } from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"
import { Field, FieldError, FieldLabel } from "@repo/ui/components/ui/field"
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
import { Switch } from "@repo/ui/components/ui/switch"
import { Textarea } from "@repo/ui/components/ui/textarea"

import { TimeSelect } from "@/components/time-select"
import { FormSection, FormSheetHeader } from "@/features/tenant/components/form-section"
import { fullName } from "@/features/tenant/staff/components/columns"
import { initialStaff } from "@/features/tenant/staff/lib/data"

import {
  timeOffSchema,
  type TimeOff,
  type TimeOffInput,
} from "../lib/time-off-schema"

interface TimeOffFormValues {
  staffId: string
  date: string
  allDay: boolean
  startTime: string
  endTime: string
  reason: string
}

function toFormValues(timeOff?: TimeOff | null, defaultDate?: string): TimeOffFormValues {
  if (!timeOff) {
    return {
      staffId: "",
      date: defaultDate ?? "",
      allDay: true,
      startTime: "09:00",
      endTime: "17:00",
      reason: "",
    }
  }
  return {
    staffId: timeOff.staffId,
    date: timeOff.date,
    allDay: timeOff.allDay,
    startTime: timeOff.startTime ?? "09:00",
    endTime: timeOff.endTime ?? "17:00",
    reason: timeOff.reason ?? "",
  }
}

interface TimeOffFormBodyProps {
  timeOff?: TimeOff | null
  defaultDate?: string
  onSubmit: (values: TimeOffInput) => void
  onCancel: () => void
}

function TimeOffFormBody({
  timeOff,
  defaultDate,
  onSubmit,
  onCancel,
}: TimeOffFormBodyProps) {
  const form = useForm<TimeOffFormValues>({
    resolver: zodResolver(timeOffSchema),
    defaultValues: toFormValues(timeOff, defaultDate),
  })
  const allDay = useWatch({ control: form.control, name: "allDay" })
  const staffId = useWatch({ control: form.control, name: "staffId" })
  const isEdit = Boolean(timeOff)

  function handleSubmit(values: TimeOffFormValues) {
    onSubmit({
      ...values,
      startTime: values.allDay ? undefined : values.startTime,
      endTime: values.allDay ? undefined : values.endTime,
    })
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex h-full flex-col" noValidate>
      <SheetHeader>
        <FormSheetHeader
          icon={CalendarOff}
          title={isEdit ? "Edit time off" : "Add time off"}
          description="Block out a staff member's availability."
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <FormSection icon={UserRound} title="Staff">
          <Field data-invalid={Boolean(form.formState.errors.staffId)}>
            <FieldLabel htmlFor="time-off-staff">
              Staff <span className="text-destructive">*</span>
            </FieldLabel>
            <Select
              value={staffId}
              onValueChange={(value) => form.setValue("staffId", value ?? "", { shouldDirty: true })}
            >
              <SelectTrigger
                id="time-off-staff"
                className="w-full"
                aria-invalid={Boolean(form.formState.errors.staffId)}
              >
                <SelectValue placeholder="Select staff">
                  {(value: string | null) => {
                    const staff = initialStaff.find((s) => s.id === value)
                    return staff ? fullName(staff) : "Select staff"
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {initialStaff.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {fullName(staff)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError>{form.formState.errors.staffId?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="time-off-reason">Reason</FieldLabel>
            <Textarea
              id="time-off-reason"
              placeholder="Personal leave, sick day..."
              {...form.register("reason")}
            />
          </Field>
        </FormSection>

        <FormSection icon={CalendarOff} title="Date & time">
          <Field data-invalid={Boolean(form.formState.errors.date)}>
            <FieldLabel htmlFor="time-off-date">
              Date <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="time-off-date"
              type="date"
              aria-invalid={Boolean(form.formState.errors.date)}
              {...form.register("date")}
            />
            <FieldError>{form.formState.errors.date?.message}</FieldError>
          </Field>

          <Field orientation="horizontal">
            <Controller name="allDay" control={form.control} render={({ field }) => <Switch id="time-off-all-day" checked={field.value} onCheckedChange={field.onChange} />} />
            <FieldLabel htmlFor="time-off-all-day">All day</FieldLabel>
          </Field>

          {!allDay && (
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="time-off-start">Start Time</FieldLabel>
                <Controller name="startTime" control={form.control} render={({ field }) => <TimeSelect id="time-off-start" value={field.value} onChange={field.onChange} />} />
              </Field>

              <Field data-invalid={Boolean(form.formState.errors.endTime)}>
                <FieldLabel htmlFor="time-off-end">End Time</FieldLabel>
                <Controller name="endTime" control={form.control} render={({ field }) => <TimeSelect id="time-off-end" value={field.value} onChange={field.onChange} />} />
                <FieldError>{form.formState.errors.endTime?.message}</FieldError>
              </Field>
            </div>
          )}
        </FormSection>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isEdit ? "Save changes" : "Add time off"}</Button>
      </SheetFooter>
    </form>
  )
}

interface TimeOffFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  timeOff?: TimeOff | null
  defaultDate?: string
  onSubmit: (values: TimeOffInput) => void
}

export function TimeOffFormSheet({
  open,
  onOpenChange,
  timeOff,
  defaultDate,
  onSubmit,
}: TimeOffFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        {open && (
          <TimeOffFormBody
            key={timeOff?.id ?? "new"}
            timeOff={timeOff}
            defaultDate={defaultDate}
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
