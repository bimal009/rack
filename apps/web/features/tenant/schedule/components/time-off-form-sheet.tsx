"use client"

import { useState, type FormEvent } from "react"
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

import { fieldErrors } from "../lib/validation"
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
  const [values, setValues] = useState<TimeOffFormValues>(() =>
    toFormValues(timeOff, defaultDate)
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = Boolean(timeOff)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const result = timeOffSchema.safeParse({
      staffId: values.staffId,
      date: values.date,
      allDay: values.allDay,
      startTime: values.allDay ? undefined : values.startTime,
      endTime: values.allDay ? undefined : values.endTime,
      reason: values.reason,
    })

    if (!result.success) {
      setErrors(fieldErrors(result.error))
      return
    }

    setErrors({})
    onSubmit(result.data)
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <SheetHeader>
        <FormSheetHeader
          icon={CalendarOff}
          title={isEdit ? "Edit time off" : "Add time off"}
          description="Block out a staff member's availability."
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <FormSection icon={UserRound} title="Staff">
          <Field data-invalid={Boolean(errors.staffId)}>
            <FieldLabel htmlFor="time-off-staff">
              Staff <span className="text-destructive">*</span>
            </FieldLabel>
            <Select
              value={values.staffId}
              onValueChange={(value) =>
                setValues((v) => ({ ...v, staffId: value ?? "" }))
              }
            >
              <SelectTrigger
                id="time-off-staff"
                className="w-full"
                aria-invalid={Boolean(errors.staffId)}
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
            <FieldError>{errors.staffId}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="time-off-reason">Reason</FieldLabel>
            <Textarea
              id="time-off-reason"
              placeholder="Personal leave, sick day..."
              value={values.reason}
              onChange={(e) =>
                setValues((v) => ({ ...v, reason: e.target.value }))
              }
            />
          </Field>
        </FormSection>

        <FormSection icon={CalendarOff} title="Date & time">
          <Field data-invalid={Boolean(errors.date)}>
            <FieldLabel htmlFor="time-off-date">
              Date <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="time-off-date"
              type="date"
              value={values.date}
              aria-invalid={Boolean(errors.date)}
              onChange={(e) =>
                setValues((v) => ({ ...v, date: e.target.value }))
              }
            />
            <FieldError>{errors.date}</FieldError>
          </Field>

          <Field orientation="horizontal">
            <Switch
              id="time-off-all-day"
              checked={values.allDay}
              onCheckedChange={(checked) =>
                setValues((v) => ({ ...v, allDay: checked }))
              }
            />
            <FieldLabel htmlFor="time-off-all-day">All day</FieldLabel>
          </Field>

          {!values.allDay && (
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="time-off-start">Start Time</FieldLabel>
                <TimeSelect
                  id="time-off-start"
                  value={values.startTime}
                  onChange={(startTime) =>
                    setValues((v) => ({ ...v, startTime }))
                  }
                />
              </Field>

              <Field data-invalid={Boolean(errors.endTime)}>
                <FieldLabel htmlFor="time-off-end">End Time</FieldLabel>
                <TimeSelect
                  id="time-off-end"
                  value={values.endTime}
                  onChange={(endTime) =>
                    setValues((v) => ({ ...v, endTime }))
                  }
                />
                <FieldError>{errors.endTime}</FieldError>
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
